import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

export interface App {
  id: string;
  name: string;
  icon: string;
  category: string;
  bundleId?: string;
  isSystemApp?: boolean;
}

const SELECTED_APPS_KEY = 'selected_apps_for_focus';
const APP_CATEGORIES_KEY = 'app_categories';

class AppService {
  private apps: App[] = [];
  private selectedApps: string[] = [];
  private appCategories: Record<string, string> = {};

  /**
   * Initialize the app service and load stored data
   */
  async initialize(): Promise<void> {
    await this.loadSelectedApps();
    await this.loadAppCategories();
    await this.detectInstalledApps();
  }

  /**
   * Detect installed apps on the device
   */
  private async detectInstalledApps(): Promise<void> {
    try {
      // For now, we'll use a combination of common apps and system apps
      // In a real implementation, you'd use device-specific APIs
      const commonApps = this.getCommonApps();
      const systemApps = this.getSystemApps();
      
      this.apps = [...commonApps, ...systemApps];
      
      // Categorize apps based on stored categories or default categories
      this.apps.forEach(app => {
        if (!app.category) {
          app.category = this.categorizeApp(app.name, app.bundleId);
        }
      });
    } catch (error) {
      console.error('Error detecting installed apps:', error);
      // Fallback to common apps if detection fails
      this.apps = this.getCommonApps();
    }
  }

  /**
   * Get common apps that are likely to be installed
   */
  private getCommonApps(): App[] {
    return [
      {
        id: "com.instagram.ios",
        name: "Instagram",
        icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=instagram",
        category: "Social",
        bundleId: "com.instagram.ios",
        isSystemApp: false,
      },
      {
        id: "com.facebook.Facebook",
        name: "Facebook",
        icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=facebook",
        category: "Social",
        bundleId: "com.facebook.Facebook",
        isSystemApp: false,
      },
      {
        id: "com.twitter.ios",
        name: "Twitter",
        icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=twitter",
        category: "Social",
        bundleId: "com.twitter.ios",
        isSystemApp: false,
      },
      {
        id: "com.burbn.tiktok",
        name: "TikTok",
        icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=tiktok",
        category: "Entertainment",
        bundleId: "com.burbn.tiktok",
        isSystemApp: false,
      },
      {
        id: "com.netflix.Netflix",
        name: "Netflix",
        icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=netflix",
        category: "Entertainment",
        bundleId: "com.netflix.Netflix",
        isSystemApp: false,
      },
      {
        id: "com.google.ios.youtube",
        name: "YouTube",
        icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=youtube",
        category: "Entertainment",
        bundleId: "com.google.ios.youtube",
        isSystemApp: false,
      },
      {
        id: "com.reddit.Reddit",
        name: "Reddit",
        icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=reddit",
        category: "Social",
        bundleId: "com.reddit.Reddit",
        isSystemApp: false,
      },
      {
        id: "com.spotify.client",
        name: "Spotify",
        icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=spotify",
        category: "Music",
        bundleId: "com.spotify.client",
        isSystemApp: false,
      },
      {
        id: "com.amazon.Amazon",
        name: "Amazon",
        icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=amazon",
        category: "Shopping",
        bundleId: "com.amazon.Amazon",
        isSystemApp: false,
      },
      {
        id: "com.discord",
        name: "Discord",
        icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=discord",
        category: "Social",
        bundleId: "com.discord",
        isSystemApp: false,
      },
      {
        id: "com.snapchat.ios",
        name: "Snapchat",
        icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=snapchat",
        category: "Social",
        bundleId: "com.snapchat.ios",
        isSystemApp: false,
      },
      {
        id: "com.whatsapp.WhatsApp",
        name: "WhatsApp",
        icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=whatsapp",
        category: "Communication",
        bundleId: "com.whatsapp.WhatsApp",
        isSystemApp: false,
      },
      {
        id: "com.ubercab.UberClient",
        name: "Uber",
        icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=uber",
        category: "Transportation",
        bundleId: "com.ubercab.UberClient",
        isSystemApp: false,
      },
      {
        id: "com.airbnb.Airbnb",
        name: "Airbnb",
        icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=airbnb",
        category: "Travel",
        bundleId: "com.airbnb.Airbnb",
        isSystemApp: false,
      },
    ];
  }

  /**
   * Get system apps that are always available
   */
  private getSystemApps(): App[] {
    const systemApps: App[] = [
      {
        id: "com.apple.mobilesafari",
        name: "Safari",
        icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=safari",
        category: "Productivity",
        bundleId: "com.apple.mobilesafari",
        isSystemApp: true,
      },
      {
        id: "com.apple.MobileSMS",
        name: "Messages",
        icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=messages",
        category: "Communication",
        bundleId: "com.apple.MobileSMS",
        isSystemApp: true,
      },
      {
        id: "com.apple.mobilemail",
        name: "Mail",
        icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=mail",
        category: "Communication",
        bundleId: "com.apple.mobilemail",
        isSystemApp: true,
      },
      {
        id: "com.apple.phone",
        name: "Phone",
        icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=phone",
        category: "Communication",
        bundleId: "com.apple.phone",
        isSystemApp: true,
      },
      {
        id: "com.apple.camera",
        name: "Camera",
        icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=camera",
        category: "Media",
        bundleId: "com.apple.camera",
        isSystemApp: true,
      },
      {
        id: "com.apple.mobilephotos",
        name: "Photos",
        icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=photos",
        category: "Media",
        bundleId: "com.apple.mobilephotos",
        isSystemApp: true,
      },
      {
        id: "com.apple.mobilecal",
        name: "Calendar",
        icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=calendar",
        category: "Productivity",
        bundleId: "com.apple.mobilecal",
        isSystemApp: true,
      },
      {
        id: "com.apple.mobilemaps",
        name: "Maps",
        icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=maps",
        category: "Navigation",
        bundleId: "com.apple.mobilemaps",
        isSystemApp: true,
      },
    ];

    return systemApps;
  }

  /**
   * Categorize an app based on its name and bundle ID
   */
  private categorizeApp(name: string, bundleId?: string): string {
    const lowerName = name.toLowerCase();
    const lowerBundleId = bundleId?.toLowerCase() || '';

    // Social media apps
    if (lowerName.includes('instagram') || lowerName.includes('facebook') || 
        lowerName.includes('twitter') || lowerName.includes('tiktok') || 
        lowerName.includes('snapchat') || lowerName.includes('discord') ||
        lowerName.includes('reddit') || lowerName.includes('linkedin')) {
      return 'Social';
    }

    // Entertainment apps
    if (lowerName.includes('netflix') || lowerName.includes('youtube') || 
        lowerName.includes('spotify') || lowerName.includes('twitch') ||
        lowerName.includes('hulu') || lowerName.includes('disney')) {
      return 'Entertainment';
    }

    // Communication apps
    if (lowerName.includes('whatsapp') || lowerName.includes('telegram') || 
        lowerName.includes('signal') || lowerName.includes('messages') ||
        lowerName.includes('mail') || lowerName.includes('phone')) {
      return 'Communication';
    }

    // Shopping apps
    if (lowerName.includes('amazon') || lowerName.includes('ebay') || 
        lowerName.includes('etsy') || lowerName.includes('shopify')) {
      return 'Shopping';
    }

    // Productivity apps
    if (lowerName.includes('safari') || lowerName.includes('chrome') || 
        lowerName.includes('calendar') || lowerName.includes('notes') ||
        lowerName.includes('reminders') || lowerName.includes('pages') ||
        lowerName.includes('numbers') || lowerName.includes('keynote')) {
      return 'Productivity';
    }

    // Navigation apps
    if (lowerName.includes('maps') || lowerName.includes('waze') || 
        lowerName.includes('google maps') || lowerName.includes('apple maps')) {
      return 'Navigation';
    }

    // Transportation apps
    if (lowerName.includes('uber') || lowerName.includes('lyft') || 
        lowerName.includes('doordash') || lowerName.includes('grubhub')) {
      return 'Transportation';
    }

    // Travel apps
    if (lowerName.includes('airbnb') || lowerName.includes('booking') || 
        lowerName.includes('expedia') || lowerName.includes('hotels')) {
      return 'Travel';
    }

    // Media apps
    if (lowerName.includes('camera') || lowerName.includes('photos') || 
        lowerName.includes('music') || lowerName.includes('podcasts')) {
      return 'Media';
    }

    // Default category
    return 'Other';
  }

  /**
   * Load selected apps from storage
   */
  private async loadSelectedApps(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(SELECTED_APPS_KEY);
      if (stored) {
        this.selectedApps = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading selected apps:', error);
      this.selectedApps = [];
    }
  }

  /**
   * Load app categories from storage
   */
  private async loadAppCategories(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(APP_CATEGORIES_KEY);
      if (stored) {
        this.appCategories = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading app categories:', error);
      this.appCategories = {};
    }
  }

  /**
   * Save selected apps to storage
   */
  async saveSelectedApps(appIds: string[]): Promise<void> {
    try {
      this.selectedApps = appIds;
      await AsyncStorage.setItem(SELECTED_APPS_KEY, JSON.stringify(appIds));
    } catch (error) {
      console.error('Error saving selected apps:', error);
    }
  }

  /**
   * Save app categories to storage
   */
  async saveAppCategories(categories: Record<string, string>): Promise<void> {
    try {
      this.appCategories = categories;
      await AsyncStorage.setItem(APP_CATEGORIES_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving app categories:', error);
    }
  }

  /**
   * Get all available apps
   */
  async getApps(): Promise<App[]> {
    if (this.apps.length === 0) {
      await this.initialize();
    }
    return this.apps;
  }

  /**
   * Get currently selected apps
   */
  async getSelectedApps(): Promise<string[]> {
    if (this.selectedApps.length === 0) {
      await this.loadSelectedApps();
    }
    return this.selectedApps;
  }

  /**
   * Get apps by category
   */
  async getAppsByCategory(category: string): Promise<App[]> {
    const apps = await this.getApps();
    return apps.filter(app => app.category === category);
  }

  /**
   * Get all available categories
   */
  async getCategories(): Promise<string[]> {
    const apps = await this.getApps();
    return Array.from(new Set(apps.map(app => app.category)));
  }

  /**
   * Check if an app is selected
   */
  async isAppSelected(appId: string): Promise<boolean> {
    const selectedApps = await this.getSelectedApps();
    return selectedApps.includes(appId);
  }

  /**
   * Get selected app details
   */
  async getSelectedAppDetails(): Promise<App[]> {
    const apps = await this.getApps();
    const selectedApps = await this.getSelectedApps();
    return apps.filter(app => selectedApps.includes(app.id));
  }

  /**
   * Update app category
   */
  async updateAppCategory(appId: string, category: string): Promise<void> {
    const app = this.apps.find(a => a.id === appId);
    if (app) {
      app.category = category;
      // Update the stored categories
      this.appCategories[appId] = category;
      await this.saveAppCategories(this.appCategories);
    }
  }

  /**
   * Search apps by name
   */
  async searchApps(query: string): Promise<App[]> {
    const apps = await this.getApps();
    const lowerQuery = query.toLowerCase();
    return apps.filter(app => 
      app.name.toLowerCase().includes(lowerQuery) ||
      app.bundleId?.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get app usage statistics (placeholder for future implementation)
   */
  async getAppUsageStats(): Promise<Record<string, number>> {
    // This would integrate with device usage statistics
    // For now, return empty object
    return {};
  }

  /**
   * Reset all selected apps
   */
  async resetSelectedApps(): Promise<void> {
    await this.saveSelectedApps([]);
  }

  /**
   * Get focus mode statistics
   */
  async getFocusModeStats(): Promise<{
    totalApps: number;
    selectedApps: number;
    categories: string[];
    mostSelectedCategory: string;
  }> {
    const apps = await this.getApps();
    const selectedApps = await this.getSelectedApps();
    const categories = await this.getCategories();
    
    // Count apps by category
    const categoryCounts: Record<string, number> = {};
    selectedApps.forEach(appId => {
      const app = apps.find(a => a.id === appId);
      if (app) {
        categoryCounts[app.category] = (categoryCounts[app.category] || 0) + 1;
      }
    });

    const mostSelectedCategory = Object.keys(categoryCounts).reduce((a, b) => 
      categoryCounts[a] > categoryCounts[b] ? a : b, 'Other'
    );

    return {
      totalApps: apps.length,
      selectedApps: selectedApps.length,
      categories,
      mostSelectedCategory,
    };
  }
}

export const appService = new AppService();
