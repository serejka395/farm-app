
import { UserProfile } from '../types';

class SecurityService {
  private timeOffset: number = 0;
  private lastActionTime: number = 0;
  private readonly ACTION_COOLDOWN = 100; // ms

  // Behavioral Analysis State
  private clickHistory: { t: number, x: number, y: number }[] = [];
  private readonly HISTORY_SIZE = 20;
  private readonly ENTROPY_THRESHOLD = 5; // Low variance = bot
  private readonly PRECISION_THRESHOLD = 0; // 0 variance = pixel perfect bot

  async syncTime() {
    try {
      const start = Date.now();
      const response = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC').catch(() => null);
      if (response && response.ok) {
        const data = await response.json();
        this.timeOffset = new Date(data.utc_datetime).getTime() - Date.now();
      } else {
        const fallback = await fetch(window.location.origin, { method: 'HEAD' });
        const dateStr = fallback.headers.get('date');
        if (dateStr) this.timeOffset = new Date(dateStr).getTime() - Date.now();
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

  /**
   * Main validation entry point. 
   * @param profile UserProfile to flag if caught
   * @param coords Optional coordinates of the click event
   */
  validateAction(profile: UserProfile, coords?: { x: number, y: number }): boolean {
    if (profile.securityStatus === 'banned') return false;

    const now = Date.now();

    // 1. Strict Cooldown (Speedhack check)
    if (now - this.lastActionTime < this.ACTION_COOLDOWN) {
      this.flagUser(profile, "Speedhack: Action too fast");
      return false; // Soft block, don't ban immediately for lag spikes
    }
    this.lastActionTime = now;

    // 2. Behavioral Analysis (if coords provided)
    if (coords) {
      this.trackBehavior(now, coords);
      if (this.isBotBehavior()) {
        this.flagUser(profile, "Bot: Robotic movement detected");
        return false;
      }
    }

    return true;
  }

  private trackBehavior(t: number, c: { x: number, y: number }) {
    this.clickHistory.push({ t, x: c.x, y: c.y });
    if (this.clickHistory.length > this.HISTORY_SIZE) this.clickHistory.shift();
  }

  private isBotBehavior(): boolean {
    if (this.clickHistory.length < 10) return false;

    // A. Timing Entropy (Variance of intervals)
    let intervals = [];
    for (let i = 1; i < this.clickHistory.length; i++) {
      intervals.push(this.clickHistory[i].t - this.clickHistory[i - 1].t);
    }
    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / intervals.length;

    // B. Coordinate Variance (Pixel perfect clicking)
    const xVariance = this.clickHistory.reduce((a, b) => a + Math.pow(b.x - this.clickHistory[0].x, 2), 0);
    const yVariance = this.clickHistory.reduce((a, b) => a + Math.pow(b.y - this.clickHistory[0].y, 2), 0);

    // Human clicks vary in timing and micro-positioning
    if (variance < this.ENTROPY_THRESHOLD && variance > 0) return true; // Too perfect timing
    if (xVariance === 0 && yVariance === 0) return true; // Pixel perfect script

    return false;
  }

  flagUser(profile: UserProfile, reason: string) {
    console.warn(`[Security] FLAGGING USER: ${reason}`);

    if (profile.securityStatus === 'banned') return;

    // Append log
    const logs = profile.cheatDetectionLogs || [];
    logs.push(`${new Date().toISOString()}: ${reason}`);

    // Update profile (Mutation is risky but necessary for sync back)
    profile.cheatDetectionLogs = logs;

    // Upgrade status
    if (profile.securityStatus === 'verified') {
      profile.securityStatus = 'flagged';
    } else if (profile.securityStatus === 'flagged' && logs.length > 5) {
      profile.securityStatus = 'banned';
    }
  }

  // Honeypot Trap
  triggerHoneypot(profile: UserProfile) {
    this.flagUser(profile, "Honeypot: Interaction with invisible element");
    profile.securityStatus = 'banned'; // Instant ban
  }

  generateChecksum(profile: UserProfile, wallet: string): string {
    const dataString = [
      profile.balance.toFixed(2), // Precise formatting
      profile.xp,
      profile.level,
      wallet,
      Object.values(profile.upgrades).join(','), // Simplified upgrade hash
      "v3.0-secure"
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
    // Simple XOR or just Base64 reversal for now (as client side is always breakable)
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
