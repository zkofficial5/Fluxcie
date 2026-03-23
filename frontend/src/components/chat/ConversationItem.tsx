import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Conversation } from '@/types/chat';
import { useChat } from '@/context/ChatContext';
import UserAvatar from './UserAvatar';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  index: number;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onClick,
  index,
}) => {
  const { getOtherParticipant, currentUser } = useChat();
  const otherUser = getOtherParticipant(conversation);

  const displayName = conversation.isGroup
    ? conversation.groupName
    : otherUser?.name || 'Unknown';

  const displayAvatar = conversation.isGroup
    ? conversation.groupAvatar
    : otherUser?.avatar;

  const lastMessagePreview = conversation.lastMessage
    ? conversation.lastMessage.senderId === currentUser.id
      ? `You: ${conversation.lastMessage.content}`
      : conversation.lastMessage.content
    : 'No messages yet';

  const timeAgo = conversation.lastMessage
    ? formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: false })
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onClick}
      whileHover={{ x: 4 }}
      className={cn(
        'relative flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300',
        'hover:bg-glass-border/15 group conversation-card',
        isActive && 'active'
      )}
    >
      {/* Active indicator line */}
      {isActive && (
        <motion.div
          layoutId="activeConversation"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-gradient-to-b from-primary to-accent"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}

      {conversation.isGroup ? (
        <div className="relative">
          <Avatar className={cn(
            "h-12 w-12 ring-2 transition-all duration-300",
            isActive ? "ring-primary/50" : "ring-glass-border/30"
          )}>
            <AvatarImage src={displayAvatar} alt={displayName} />
            <AvatarFallback className="bg-gradient-to-br from-primary/50 to-accent/50 text-sm font-medium">
              {displayName?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <motion.span 
            whileHover={{ scale: 1.1 }}
            className="absolute -bottom-0.5 -right-0.5 bg-gradient-to-r from-primary to-accent text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-background shadow-lg"
          >
            {conversation.participants.length}
          </motion.span>
        </div>
      ) : (
        otherUser && <UserAvatar user={otherUser} size="lg" />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={cn(
            "font-semibold truncate transition-colors",
            isActive ? "text-foreground" : "text-foreground/90"
          )}>
            {displayName}
          </span>
          <span className="text-[11px] text-muted-foreground/70 shrink-0">{timeAgo}</span>
        </div>
        <p className={cn(
          "text-sm truncate mt-0.5 transition-colors",
          conversation.unreadCount > 0 
            ? "text-foreground/80 font-medium" 
            : "text-muted-foreground/70"
        )}>
          {lastMessagePreview}
        </p>
      </div>

      {conversation.unreadCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className="flex-shrink-0 min-w-[22px] h-[22px] px-1.5 flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent text-[11px] font-bold text-primary-foreground shadow-lg shadow-primary/30"
        >
          {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
        </motion.span>
      )}
    </motion.div>
  );
};

export default ConversationItem;
