import AsyncStorage from '@react-native-async-storage/async-storage';
import { appService } from './AppService';

export interface FocusSession {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in milliseconds
  appsBlocked: number;
  blockedAppIds: string[]; // New field to track specific apps
}

const FOCUS_SESSIONS_KEY = 'focus_sessions';

class FocusSessionService {
  private sessions: FocusSession[] = [];

  async loadSessions(): Promise<FocusSession[]> {
    try {
      const storedSessions = await AsyncStorage.getItem(FOCUS_SESSIONS_KEY);
      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions);
        // Convert string dates back to Date objects and ensure blockedAppIds exists
        this.sessions = parsedSessions.map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: new Date(session.endTime),
          blockedAppIds: session.blockedAppIds || [], // Ensure backward compatibility
        }));
      }
      return this.sessions;
    } catch (error) {
      console.error('Error loading focus sessions:', error);
      return [];
    }
  }

  async saveSession(session: FocusSession): Promise<void> {
    try {
      this.sessions.unshift(session); // Add to beginning of array
      // Keep only the last 50 sessions to prevent storage bloat
      if (this.sessions.length > 50) {
        this.sessions = this.sessions.slice(0, 50);
      }
      await AsyncStorage.setItem(FOCUS_SESSIONS_KEY, JSON.stringify(this.sessions));
    } catch (error) {
      console.error('Error saving focus session:', error);
    }
  }

  /**
   * Create a new focus session with current selected apps
   */
  async createSession(startTime: Date, endTime: Date): Promise<FocusSession> {
    try {
      // Get the currently selected apps for blocking
      const selectedApps = await appService.getSelectedApps();
      const selectedAppDetails = await appService.getSelectedAppDetails();
      
      const session: FocusSession = {
        id: Date.now().toString(),
        startTime,
        endTime,
        duration: endTime.getTime() - startTime.getTime(),
        appsBlocked: selectedApps.length,
        blockedAppIds: selectedApps,
      };

      await this.saveSession(session);
      return session;
    } catch (error) {
      console.error('Error creating focus session:', error);
      // Fallback to basic session if app service fails
      const session: FocusSession = {
        id: Date.now().toString(),
        startTime,
        endTime,
        duration: endTime.getTime() - startTime.getTime(),
        appsBlocked: 0,
        blockedAppIds: [],
      };
      await this.saveSession(session);
      return session;
    }
  }

  /**
   * Get sessions with detailed app information
   */
  async getSessionsWithAppDetails(): Promise<(FocusSession & { blockedAppNames: string[] })[]> {
    const sessions = await this.loadSessions();
    const appDetails = await appService.getApps();
    
    return sessions.map(session => {
      const blockedAppNames = session.blockedAppIds
        .map(appId => {
          const app = appDetails.find(a => a.id === appId);
          return app ? app.name : appId;
        })
        .filter(name => name !== appId); // Remove app IDs that couldn't be resolved
      
      return {
        ...session,
        blockedAppNames,
      };
    });
  }

  /**
   * Get statistics about blocked apps across all sessions
   */
  async getBlockedAppStats(): Promise<{
    totalSessions: number;
    totalBlockedApps: number;
    mostBlockedApps: Array<{ appId: string; name: string; count: number }>;
    averageAppsPerSession: number;
  }> {
    const sessions = await this.loadSessions();
    const appDetails = await appService.getApps();
    
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalBlockedApps: 0,
        mostBlockedApps: [],
        averageAppsPerSession: 0,
      };
    }

    // Count how many times each app was blocked
    const appBlockCounts: Record<string, number> = {};
    let totalBlockedApps = 0;

    sessions.forEach(session => {
      session.blockedAppIds.forEach(appId => {
        appBlockCounts[appId] = (appBlockCounts[appId] || 0) + 1;
        totalBlockedApps++;
      });
    });

    // Convert to array and sort by count
    const mostBlockedApps = Object.entries(appBlockCounts)
      .map(([appId, count]) => {
        const app = appDetails.find(a => a.id === appId);
        return {
          appId,
          name: app ? app.name : appId,
          count,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 most blocked apps

    return {
      totalSessions: sessions.length,
      totalBlockedApps,
      mostBlockedApps,
      averageAppsPerSession: totalBlockedApps / sessions.length,
    };
  }

  async getRecentSessions(limit: number = 10): Promise<FocusSession[]> {
    await this.loadSessions();
    return this.sessions.slice(0, limit);
  }

  async getSessionsByDateRange(startDate: Date, endDate: Date): Promise<FocusSession[]> {
    await this.loadSessions();
    return this.sessions.filter(session => 
      session.startTime >= startDate && session.startTime <= endDate
    );
  }

  async getTotalFocusTime(days: number = 7): Promise<number> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const sessions = await this.getSessionsByDateRange(startDate, endDate);
    return sessions.reduce((total, session) => total + session.duration, 0);
  }

  async getAverageSessionDuration(days: number = 7): Promise<number> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const sessions = await this.getSessionsByDateRange(startDate, endDate);
    if (sessions.length === 0) return 0;
    
    const totalDuration = sessions.reduce((total, session) => total + session.duration, 0);
    return totalDuration / sessions.length;
  }

  async clearAllSessions(): Promise<void> {
    try {
      this.sessions = [];
      await AsyncStorage.removeItem(FOCUS_SESSIONS_KEY);
    } catch (error) {
      console.error('Error clearing focus sessions:', error);
    }
  }

  async createSampleData(): Promise<void> {
    const sampleSessions: FocusSession[] = [
      {
        id: '1',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        endTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        duration: 60 * 60 * 1000, // 1 hour
        appsBlocked: 5,
        blockedAppIds: ['com.instagram.ios', 'com.facebook.Facebook', 'com.twitter.ios', 'com.burbn.tiktok', 'com.netflix.Netflix'],
      },
      {
        id: '2',
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        endTime: new Date(Date.now() - 23 * 60 * 60 * 1000), // 23 hours ago
        duration: 45 * 60 * 1000, // 45 minutes
        appsBlocked: 3,
        blockedAppIds: ['com.instagram.ios', 'com.facebook.Facebook', 'com.twitter.ios'],
      },
      {
        id: '3',
        startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
        duration: 2 * 60 * 60 * 1000, // 2 hours
        appsBlocked: 7,
        blockedAppIds: ['com.instagram.ios', 'com.facebook.Facebook', 'com.twitter.ios', 'com.burbn.tiktok', 'com.netflix.Netflix', 'com.youtube.ios', 'com.reddit.Reddit'],
      },
    ];

    this.sessions = sampleSessions;
    await AsyncStorage.setItem(FOCUS_SESSIONS_KEY, JSON.stringify(this.sessions));
  }
}

export const focusSessionService = new FocusSessionService();
