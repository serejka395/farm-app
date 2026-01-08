import { UserProfile, Plot } from '../types';
import { security } from './securityService';
import { supabase } from './supabaseClient';

export const db = {
  /**
   * Saves user progress to Supabase (and LocalStorage as backup)
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
    const stringified = JSON.stringify(dataToSave);
    const securedData = security.obfuscate(stringified);
    localStorage.setItem(`farm_v2_${walletAddress}`, securedData);

    // 3. Supabase Sync (Cloud Persistence)
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          wallet_address: walletAddress,
          data: dataToSave,
          updated_at: new Date().toISOString()
        }, { onConflict: 'wallet_address' });

      if (error) {
        // Silent fail for now to avoid console spam if DB is down
        // console.error('[Supabase] Save failed:', error.message);
      }
    } catch (e) {
      // Suppress network errors (like DNS failure to Supabase)
      // console.error('[Supabase] Connection error during save');
    }
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
  }
};
