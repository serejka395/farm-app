
import { UserProfile } from '../types';

class SecurityService {
  private timeOffset: number = 0;
  private lastActionTime: number = 0;
  private readonly ACTION_COOLDOWN = 150;

  async syncTime() {
    try {
      const start = Date.now();
      // Try multiple time APIs for better reliability
      const response = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC').catch(() => null);
      
      if (response && response.ok) {
        const data = await response.json();
        const serverTime = new Date(data.utc_datetime).getTime();
        this.timeOffset = serverTime - Date.now();
      } else {
        // Fallback to simple header date
        const fallback = await fetch(window.location.origin, { method: 'HEAD' });
        const dateStr = fallback.headers.get('date');
        if (dateStr) {
          this.timeOffset = new Date(dateStr).getTime() - Date.now();
        }
      }
      console.log("[Security] Time synced, offset:", this.timeOffset);
    } catch (e) {
      console.warn("[Security] Time sync failed, using local time.");
      this.timeOffset = 0;
    }
  }

  getServerNow(): number {
    return Date.now() + this.timeOffset;
  }

  validateAction(): boolean {
    const now = Date.now();
    if (now - this.lastActionTime < this.ACTION_COOLDOWN) return false;
    this.lastActionTime = now;
    return true;
  }

  generateChecksum(profile: UserProfile, wallet: string): string {
    const dataString = [
      profile.balance,
      profile.xp,
      profile.level,
      wallet,
      JSON.stringify(profile.upgrades),
      "v2.5-final"
    ].join('|');
    
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }

  obfuscate(data: string): string {
    return btoa(encodeURIComponent(data)).split('').reverse().join('');
  }

  deobfuscate(data: string): string {
    try {
      return decodeURIComponent(atob(data.split('').reverse().join('')));
    } catch (e) {
      return "";
    }
  }
}

export const security = new SecurityService();
