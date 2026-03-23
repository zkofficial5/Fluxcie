import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Phone, Video, Search, Info, BellOff } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import UserAvatar from './UserAvatar';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import MessageInput from './MessageInput';
import SearchModal from './SearchModal';
import PinnedMessageBar from './PinnedMessageBar';
import ReplyPreview from './ReplyPreview';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatAreaProps {
  onToggleUserInfo?: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ onToggleUserInfo }) => {
  const navigate = useNavigate();
  const { conversations, activeConversationId, messages, isTyping, getOtherParticipant, pinnedMessage, setPinnedMessage, replyToMessage, setReplyTo, currentUser, getConversationMuteStatus } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const otherUser = activeConversation ? getOtherParticipant(activeConversation) : null;
  const conversationMessages = activeConversationId ? messages[activeConversationId] || [] : [];
  const isOtherTyping = activeConversationId ? isTyping[activeConversationId] : false;
  const muteStatus = activeConversationId ? getConversationMuteStatus(activeConversationId) : { muted: false, type: null };
   
   const getReplyToSenderName = () => {
     if (!replyToMessage) return '';
     if (replyToMessage.senderId === currentUser.id) return 'yourself';
     const sender = activeConversation?.participants.find(p => p.id === replyToMessage.senderId);
     return sender?.name || 'Unknown';
   };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages, isOtherTyping]);

  if (!activeConversation) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col items-center justify-center glass-subtle"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center max-w-md px-6"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-primary-soft flex items-center justify-center glow-primary">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <svg
                className="w-12 h-12 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </motion.div>
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-3 gradient-text">
            Welcome to Chat
          </h2>
          <p className="text-muted-foreground">
            Select a conversation from the sidebar to start messaging. Your messages are secure and private.
          </p>
        </motion.div>
      </motion.div>
    );
  }

  const displayName = activeConversation.isGroup
    ? activeConversation.groupName
    : otherUser?.name;

  const displayStatus = activeConversation.isGroup
    ? `${activeConversation.participants.length} members`
    : otherUser?.status === 'online'
    ? 'Active now'
    : otherUser?.status === 'away'
    ? 'Away'
    : 'Offline';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col glass-subtle overflow-hidden"
    >
      {/* Chat Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between p-4 border-b border-glass-border/30 glass"
      >
        <div className="flex items-center gap-3">
          {activeConversation.isGroup ? (
            <Avatar className="h-10 w-10 ring-2 ring-glass-border/30">
              <AvatarImage src={activeConversation.groupAvatar} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-primary/50 to-accent/50">
                {displayName?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          ) : (
            otherUser && <UserAvatar user={otherUser} size="md" />
          )}
          <div>
            <h3 className="font-semibold text-foreground">{displayName}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <span className="flex items-center gap-1">
              {otherUser?.status === 'online' && (
                <span className="w-1.5 h-1.5 rounded-full status-online" />
              )}
              {displayStatus}
              </span>
              {muteStatus.muted && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center gap-0.5 text-destructive/70">
                      <BellOff className="w-3 h-3" />
                      <span className="text-[10px]">Muted</span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {muteStatus.type === 'hours' ? 'Muted for 8 hours' : muteStatus.type === 'week' ? 'Muted for 1 week' : 'Muted until unmuted'}
                  </TooltipContent>
                </Tooltip>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'hsl(var(--glass-border) / 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/call/voice/${activeConversationId}`)}
            className="p-2.5 rounded-xl transition-colors text-muted-foreground hover:text-primary"
          >
            <Phone className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'hsl(var(--glass-border) / 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/call/video/${activeConversationId}`)}
            className="p-2.5 rounded-xl transition-colors text-muted-foreground hover:text-primary"
          >
            <Video className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'hsl(var(--glass-border) / 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleUserInfo}
            className="p-2.5 rounded-xl transition-colors text-muted-foreground hover:text-foreground"
          >
            <Info className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'hsl(var(--glass-border) / 0.3)' }}
            whileTap={{ scale: 0.95 }}
             onClick={() => setShowSearchModal(true)}
            className="p-2.5 rounded-xl transition-colors text-muted-foreground hover:text-foreground"
          >
             <Search className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

       {/* Pinned Message Bar */}
       <PinnedMessageBar message={pinnedMessage} onDismiss={() => setPinnedMessage(null)} />
       
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {conversationMessages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              showTimestamp={
                index === conversationMessages.length - 1 ||
                conversationMessages[index + 1]?.senderId !== message.senderId
              }
            />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {isOtherTyping && <TypingIndicator />}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
       <ReplyPreview
         message={replyToMessage}
         senderName={getReplyToSenderName()}
         onCancel={() => setReplyTo(null)}
       />
      <MessageInput />
       
       {/* Search Modal */}
       <SearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
    </motion.div>
  );
};

export default ChatArea;
