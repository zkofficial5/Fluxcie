import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Settings, LogOut, UserPlus, Sparkles, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import UserAvatar from './UserAvatar';
import ConversationItem from './ConversationItem';
import SignOutModal from './SignOutModal';
import { Input } from '@/components/ui/input';

const Sidebar: React.FC = () => {
  const { currentUser, conversations, activeConversationId, setActiveConversation } = useChat();
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const navigate = useNavigate();

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    if (conv.isGroup) {
      return conv.groupName?.toLowerCase().includes(searchLower);
    }
    return conv.participants.some(p => 
      p.id !== currentUser.id && p.name.toLowerCase().includes(searchLower)
    );
  });

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-80 h-full glass-strong flex flex-col border-r border-glass-border/20 relative overflow-hidden"
    >
      {/* Aurora gradient overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-48 h-48 bg-gradient-to-tl from-accent/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* User Profile Header */}
      <div className="relative p-4 border-b border-glass-border/20">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/profile')}
            className="relative group"
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/50 to-accent/50 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <UserAvatar user={currentUser} size="lg" />
          </motion.button>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-foreground truncate flex items-center gap-1.5">
              {currentUser.name}
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </h2>
            <p className="text-sm text-muted-foreground truncate">{currentUser.bio || 'Available'}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/settings')}
            className="p-2.5 rounded-xl hover:bg-glass-border/30 transition-all text-muted-foreground hover:text-primary"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative p-4">
        <motion.div
          animate={{
            boxShadow: isSearchFocused
              ? '0 0 0 2px hsl(var(--primary) / 0.3), 0 0 20px hsl(var(--primary) / 0.1)'
              : '0 0 0 0px transparent',
          }}
          className="relative rounded-2xl overflow-hidden"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="pl-11 pr-4 py-3 bg-glass/50 border-glass-border/20 focus:border-primary/40 rounded-2xl transition-all placeholder:text-muted-foreground/60"
          />
        </motion.div>
      </div>

      {/* Conversations List */}
      <div className="relative flex-1 overflow-y-auto px-2 pb-4 smooth-scroll">
        <p className="px-3 py-2 text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-widest">
          Messages
        </p>
        <AnimatePresence mode="popLayout">
          {filteredConversations.map((conversation, index) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={activeConversationId === conversation.id}
              onClick={() => setActiveConversation(conversation.id)}
              index={index}
            />
          ))}
        </AnimatePresence>

        {filteredConversations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 text-muted-foreground"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-glass-border/20 flex items-center justify-center">
              <Search className="w-6 h-6 text-muted-foreground/50" />
            </div>
            <p className="text-sm">No conversations found</p>
          </motion.div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="relative p-3 border-t border-glass-border/20">
        <div className="flex items-center justify-between gap-2">
          <motion.button
            whileHover={{ scale: 1.02, x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowSignOutModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all text-xs group"
          >
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Sign Out</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02, x: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/friends')}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all text-xs group"
          >
            <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Friends</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, x: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/requests')}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all text-xs group"
          >
            <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Requests</span>
          </motion.button>
        </div>
      </div>
       
      <SignOutModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={() => {
          logout();
          navigate('/login');
        }}
      />
    </motion.div>
  );
};

export default Sidebar;
