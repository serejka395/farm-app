import { UserProfile, Plot } from '../types';
import { security } from './securityService';
import { supabase } from './supabaseClient';

// Module-level timer for debouncing
let saveTimeout: any = null;

export const db = {
  /**
   * Saves user progress to Supabase (and LocalStorage as backup)
   * Implements DEBOUNCE strategy: LocalStorage is immediate, Cloud is delayed by 2s.
   */
  async saveUser(walletAddress: string, profile: UserProfile, plots: Plot[]) {
    // 1. Prepare data payload
    const checksum = security.generateChecksum(profile, walletAddress);
    const dataToSave = {
      profile,
      plots,
      checksum,
      updatedAt: security.getServerNow()
    };

    // 2. LocalStorage Backup (Immediate & Offline support)
    // This allows the UI to feel "instant" and survive reloads even if DB is lagging
    const stringified = JSON.stringify(dataToSave);
    const securedData = security.obfuscate(stringified);
    localStorage.setItem(`farm_v2_${walletAddress}`, securedData);

    // 3. Supabase Sync (Debounced Cloud Persistence)
    // Clear previous timer to prevent flood
    if (saveTimeout) clearTimeout(saveTimeout);

    saveTimeout = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('users')
          .upsert({
            wallet_address: walletAddress,
            data: dataToSave,
            updated_at: new Date().toISOString()
          }, { onConflict: 'wallet_address' });

        if (error) {
          // Silent fail for now
        } else {
          // console.log("[db] Cloud synced");
        }
      } catch (e) {
        // Suppress network errors
      }
    }, 2000); // 2 second delay
  },

  /**
   * Loads user progress. Prioritizes Supabase -> LocalStorage -> Null
   */
  async loadUser(walletAddress: string): Promise<{ profile: UserProfile, plots: Plot[] } | null> {
    let cloudData = null;
    let localData = null;

    // 1. Try fetching from Supabase
    try {
      const { data, error } = await supabase
        .from('users')
        .select('data')
        .eq('wallet_address', walletAddress)
        .single();

      if (data && !error) {
        cloudData = data.data;
        console.log("[db] Loaded from Cloud");
      }
    } catch (e) {
      console.warn("[db] Failed to load from cloud, falling back to local");
    }

    // 2. Fetch from LocalStorage
    const savedLocal = localStorage.getItem(`farm_v2_${walletAddress}`);
    if (savedLocal) {
      const deobfuscated = security.deobfuscate(savedLocal);
      if (deobfuscated) {
        try {
          localData = JSON.parse(deobfuscated);
        } catch (e) { console.error("Bad local data"); }
      }
    }

    // 3. Conflict Resolution / Merging strategy
    // For now, if Cloud exists, it wins (assuming it's more durable). 
    // If Cloud is missing but Local exists, it might be a new device sync or first migration.

    const finalData = cloudData || localData;

    if (!finalData) return null;

    // 4. Verify Integrity
    const { profile, checksum } = finalData;
    const validChecksum = security.generateChecksum(profile, walletAddress);

    if (checksum !== validChecksum) {
      console.error("[Security] Data tampering detected! Resetting to safe state.");
      return null;
    }

    // 5. If we loaded from Local but not Cloud, sync to Cloud immediately (Migration)
    if (localData && !cloudData) {
      console.log("[db] Migrating local data to cloud...");
      this.saveUser(walletAddress, finalData.profile, finalData.plots);
    }

    return finalData;
  },

  /**
   * Fetch list of users who referred this wallet.
   * This uses the Reverse-Lookup pattern to avoid RLS write issues.
   */
  async getReferrals(myWalletAddress: string): Promise<any[]> {
    try {
      // Query users where data->profile->referredBy == myWalletAddress
      // Note: This assumes 'data' is the JSONB column name
      const { data, error } = await supabase
        .from('users')
        .select('data')
        // Supabase JSON col filtering syntax:
        .eq('data->profile->referredBy', myWalletAddress);

      if (error) throw error;

      if (data) {
        return data.map((row: any) => ({
          id: row.data.profile.walletAddress,
          name: row.data.profile.name || 'Farmer',
          level: row.data.profile.level || 1, // Fetch Level
          joinedAt: row.data.profile.stats.joinDate || Date.now()
        }));
      }
      return [];
    } catch (e) {
      console.error("[db] Error fetching referrals:", e);
      return [];
    }
  }
};
