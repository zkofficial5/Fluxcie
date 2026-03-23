import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Moon, Sun, Bell, BellOff, Eye, EyeOff, MessageSquare, Keyboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme, ThemeType, ColorTheme } from '@/context/ThemeContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import AuroraBackground from '@/components/chat/AuroraBackground';

const themeOptions: { id: ThemeType; label: string; icon: React.ElementType }[] = [
  { id: 'dark', label: 'Dark Mode', icon: Moon },
  { id: 'light', label: 'Light Mode', icon: Sun },
];

const colorOptions: { id: ColorTheme; label: string; gradient: string }[] = [
  { id: 'purple', label: 'Purple', gradient: 'from-violet-500 to-cyan-500' },
  { id: 'blue', label: 'Ocean', gradient: 'from-blue-500 to-teal-400' },
  { id: 'green', label: 'Forest', gradient: 'from-emerald-500 to-teal-500' },
  { id: 'sunset', label: 'Sunset', gradient: 'from-orange-500 to-rose-500' },
  { id: 'rose', label: 'Rose', gradient: 'from-rose-500 to-purple-500' },
];

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const {
    themeSettings,
    notificationSettings,
    privacySettings,
    setTheme,
    setColorTheme,
    setNotificationSetting,
    setPrivacySetting,
  } = useTheme();

  return (
    <div className="relative min-h-screen bg-background">
      <AuroraBackground />
      
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative z-10 min-h-screen"
      >
        {/* Header */}
        <div className="sticky top-0 z-20 glass-strong border-b border-glass-border/30 p-4">
          <div className="max-w-2xl mx-auto flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="p-2 rounded-xl hover:bg-glass-border/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </motion.button>
            <h1 className="text-xl font-semibold text-foreground">Settings</h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto p-6 space-y-8">
          {/* Appearance Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-medium text-foreground flex items-center gap-2">
              <Sun className="w-5 h-5 text-primary" />
              Appearance
            </h2>
            
            {/* Theme Selector */}
            <div className="glass rounded-2xl p-4 space-y-4">
              <Label className="text-sm text-muted-foreground">Theme Mode</Label>
              <div className="grid grid-cols-2 gap-3">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = themeSettings.theme === option.id;
                  return (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTheme(option.id)}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        isActive
                          ? 'border-primary bg-primary/10'
                          : 'border-glass-border/30 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Icon className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-foreground'}`}>
                          {option.label}
                        </span>
                      </div>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2"
                        >
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </div>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Color Theme Selector */}
            <div className="glass rounded-2xl p-4 space-y-4">
              <Label className="text-sm text-muted-foreground">Color Theme</Label>
              <div className="grid grid-cols-5 gap-3">
                {colorOptions.map((option) => {
                  const isActive = themeSettings.colorTheme === option.id;
                  return (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setColorTheme(option.id)}
                      className="relative flex flex-col items-center gap-2"
                    >
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${option.gradient} ${
                          isActive ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : ''
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-full h-full flex items-center justify-center"
                          >
                            <Check className="w-5 h-5 text-white" />
                          </motion.div>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{option.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.section>

          {/* Notifications Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-medium text-foreground flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </h2>
            
            <div className="glass rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <Label className="text-sm font-medium text-foreground">Message Sounds</Label>
                    <p className="text-xs text-muted-foreground">Play sound for new messages</p>
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.messageSounds}
                  onCheckedChange={(checked) => setNotificationSetting('messageSounds', checked)}
                />
              </div>

              <div className="h-px bg-glass-border/30" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BellOff className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <Label className="text-sm font-medium text-foreground">Desktop Notifications</Label>
                    <p className="text-xs text-muted-foreground">Show desktop notifications</p>
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.desktopNotifications}
                  onCheckedChange={(checked) => setNotificationSetting('desktopNotifications', checked)}
                />
              </div>

              <div className="h-px bg-glass-border/30" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <Label className="text-sm font-medium text-foreground">Message Preview</Label>
                    <p className="text-xs text-muted-foreground">Show message content in notifications</p>
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.messagePreview}
                  onCheckedChange={(checked) => setNotificationSetting('messagePreview', checked)}
                />
              </div>
            </div>
          </motion.section>

          {/* Privacy Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-medium text-foreground flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Privacy
            </h2>
            
            <div className="glass rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <Label className="text-sm font-medium text-foreground">Online Status</Label>
                    <p className="text-xs text-muted-foreground">Show when you're active</p>
                  </div>
                </div>
                <Switch
                  checked={privacySettings.onlineStatusVisible}
                  onCheckedChange={(checked) => setPrivacySetting('onlineStatusVisible', checked)}
                />
              </div>

              <div className="h-px bg-glass-border/30" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <Label className="text-sm font-medium text-foreground">Read Receipts</Label>
                    <p className="text-xs text-muted-foreground">Let others know you've read messages</p>
                  </div>
                </div>
                <Switch
                  checked={privacySettings.readReceipts}
                  onCheckedChange={(checked) => setPrivacySetting('readReceipts', checked)}
                />
              </div>

              <div className="h-px bg-glass-border/30" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Keyboard className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <Label className="text-sm font-medium text-foreground">Typing Indicators</Label>
                    <p className="text-xs text-muted-foreground">Show when you're typing</p>
                  </div>
                </div>
                <Switch
                  checked={privacySettings.typingIndicators}
                  onCheckedChange={(checked) => setPrivacySetting('typingIndicators', checked)}
                />
              </div>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
