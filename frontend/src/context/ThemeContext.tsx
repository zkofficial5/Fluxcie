import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeType = 'dark' | 'light';
export type ColorTheme = 'purple' | 'blue' | 'green' | 'sunset' | 'rose';

interface ThemeSettings {
  theme: ThemeType;
  colorTheme: ColorTheme;
}

interface NotificationSettings {
  messageSounds: boolean;
  desktopNotifications: boolean;
  messagePreview: boolean;
}

interface PrivacySettings {
  onlineStatusVisible: boolean;
  readReceipts: boolean;
  typingIndicators: boolean;
}

interface ThemeContextType {
  themeSettings: ThemeSettings;
  notificationSettings: NotificationSettings;
  privacySettings: PrivacySettings;
  setTheme: (theme: ThemeType) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
  setNotificationSetting: <K extends keyof NotificationSettings>(key: K, value: NotificationSettings[K]) => void;
  setPrivacySetting: <K extends keyof PrivacySettings>(key: K, value: PrivacySettings[K]) => void;
}

const defaultThemeSettings: ThemeSettings = {
  theme: 'dark',
  colorTheme: 'purple',
};

const defaultNotificationSettings: NotificationSettings = {
  messageSounds: true,
  desktopNotifications: true,
  messagePreview: true,
};

const defaultPrivacySettings: PrivacySettings = {
  onlineStatusVisible: true,
  readReceipts: true,
  typingIndicators: true,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Color theme CSS variables
const colorThemes: Record<ColorTheme, Record<string, string>> = {
  purple: {
    '--primary': '262 83% 58%',
    '--gradient-start': '262 83% 58%',
    '--gradient-end': '199 89% 48%',
    '--ring': '262 83% 58%',
    '--sidebar-primary': '262 83% 58%',
    '--sidebar-ring': '262 83% 58%',
    '--message-sent': '262 83% 58%',
    '--typing-dot': '199 89% 48%',
  },
  blue: {
    '--primary': '217 91% 60%',
    '--gradient-start': '217 91% 60%',
    '--gradient-end': '192 91% 48%',
    '--ring': '217 91% 60%',
    '--sidebar-primary': '217 91% 60%',
    '--sidebar-ring': '217 91% 60%',
    '--message-sent': '217 91% 60%',
    '--typing-dot': '192 91% 48%',
  },
  green: {
    '--primary': '142 76% 45%',
    '--gradient-start': '142 76% 45%',
    '--gradient-end': '168 84% 40%',
    '--ring': '142 76% 45%',
    '--sidebar-primary': '142 76% 45%',
    '--sidebar-ring': '142 76% 45%',
    '--message-sent': '142 76% 45%',
    '--typing-dot': '168 84% 40%',
  },
  sunset: {
    '--primary': '25 95% 53%',
    '--gradient-start': '25 95% 53%',
    '--gradient-end': '350 89% 60%',
    '--ring': '25 95% 53%',
    '--sidebar-primary': '25 95% 53%',
    '--sidebar-ring': '25 95% 53%',
    '--message-sent': '25 95% 53%',
    '--typing-dot': '350 89% 60%',
  },
  rose: {
    '--primary': '340 82% 52%',
    '--gradient-start': '340 82% 52%',
    '--gradient-end': '280 80% 55%',
    '--ring': '340 82% 52%',
    '--sidebar-primary': '340 82% 52%',
    '--sidebar-ring': '340 82% 52%',
    '--message-sent': '340 82% 52%',
    '--typing-dot': '280 80% 55%',
  },
};

// Light mode base colors
const lightModeColors: Record<string, string> = {
  '--background': '0 0% 100%',
  '--foreground': '222 47% 11%',
  '--card': '0 0% 98%',
  '--card-foreground': '222 47% 11%',
  '--popover': '0 0% 100%',
  '--popover-foreground': '222 47% 11%',
  '--primary-foreground': '0 0% 100%',
  '--secondary': '220 14% 96%',
  '--secondary-foreground': '222 47% 11%',
  '--muted': '220 14% 96%',
  '--muted-foreground': '220 8% 46%',
  '--accent-foreground': '222 47% 11%',
  '--border': '220 13% 91%',
  '--input': '220 13% 91%',
  '--glass': '0 0% 100%',
  '--glass-border': '220 13% 85%',
  '--message-received': '220 14% 96%',
  '--sidebar-background': '0 0% 98%',
  '--sidebar-foreground': '222 47% 11%',
  '--sidebar-accent': '220 14% 96%',
  '--sidebar-accent-foreground': '222 47% 11%',
  '--sidebar-border': '220 13% 91%',
};

// Dark mode base colors
const darkModeColors: Record<string, string> = {
  '--background': '222 47% 6%',
  '--foreground': '210 40% 98%',
  '--card': '222 47% 8%',
  '--card-foreground': '210 40% 98%',
  '--popover': '222 47% 10%',
  '--popover-foreground': '210 40% 98%',
  '--primary-foreground': '210 40% 98%',
  '--secondary': '217 33% 17%',
  '--secondary-foreground': '210 40% 98%',
  '--muted': '217 33% 17%',
  '--muted-foreground': '215 20% 65%',
  '--accent-foreground': '222 47% 6%',
  '--border': '217 33% 17%',
  '--input': '217 33% 17%',
  '--glass': '222 47% 11%',
  '--glass-border': '217 33% 25%',
  '--message-received': '222 47% 15%',
  '--sidebar-background': '222 47% 7%',
  '--sidebar-foreground': '210 40% 98%',
  '--sidebar-accent': '217 33% 17%',
  '--sidebar-accent-foreground': '210 40% 98%',
  '--sidebar-border': '217 33% 17%',
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() => {
    const stored = localStorage.getItem('themeSettings');
    return stored ? JSON.parse(stored) : defaultThemeSettings;
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    const stored = localStorage.getItem('notificationSettings');
    return stored ? JSON.parse(stored) : defaultNotificationSettings;
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(() => {
    const stored = localStorage.getItem('privacySettings');
    return stored ? JSON.parse(stored) : defaultPrivacySettings;
  });

  // Apply theme and color theme to CSS
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply base colors based on theme
    const baseColors = themeSettings.theme === 'dark' ? darkModeColors : lightModeColors;
    Object.entries(baseColors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Apply color theme
    const colorVars = colorThemes[themeSettings.colorTheme];
    Object.entries(colorVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Toggle dark class for Tailwind
    if (themeSettings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('themeSettings', JSON.stringify(themeSettings));
  }, [themeSettings]);

  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  useEffect(() => {
    localStorage.setItem('privacySettings', JSON.stringify(privacySettings));
  }, [privacySettings]);

  const setTheme = (theme: ThemeType) => {
    setThemeSettings(prev => ({ ...prev, theme }));
  };

  const setColorTheme = (colorTheme: ColorTheme) => {
    setThemeSettings(prev => ({ ...prev, colorTheme }));
  };

  const setNotificationSetting = <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };

  const setPrivacySetting = <K extends keyof PrivacySettings>(
    key: K,
    value: PrivacySettings[K]
  ) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <ThemeContext.Provider
      value={{
        themeSettings,
        notificationSettings,
        privacySettings,
        setTheme,
        setColorTheme,
        setNotificationSetting,
        setPrivacySetting,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
