 import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Message } from '@/types/chat';
import { useChat } from '@/context/ChatContext';
import { Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';
 import MessageContextMenu from './MessageContextMenu';
 import DeleteMessageModal from './DeleteMessageModal';
import VoiceMessage from './VoiceMessage';

interface MessageBubbleProps {
  message: Message;
  showTimestamp?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, showTimestamp = false }) => {
   const { currentUser, conversations, activeConversationId, deleteMessage, addReaction, setReplyTo, setPinnedMessage } = useChat();
  const isSent = message.senderId === currentUser.id;
   const [showContextMenu, setShowContextMenu] = useState(false);
   const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
   const [showDeleteModal, setShowDeleteModal] = useState(false);

  const conversation = conversations.find(c => c.id === activeConversationId);
  const sender = conversation?.participants.find(p => p.id === message.senderId);

   const handleContextMenu = (e: React.MouseEvent) => {
     e.preventDefault();
     const rect = (e.target as HTMLElement).getBoundingClientRect();
     const x = Math.min(e.clientX, window.innerWidth - 200);
     const y = Math.min(e.clientY, window.innerHeight - 250);
     setContextMenuPosition({ x, y });
     setShowContextMenu(true);
   };
 
   if (message.deleted) {
     return (
       <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         className={cn('flex group', isSent ? 'justify-end' : 'justify-start')}
       >
         <div className="px-4 py-2.5 rounded-2xl bg-glass-border/20 border border-glass-border/30 italic text-muted-foreground text-sm">
           This message was deleted
         </div>
       </motion.div>
     );
   }
 
  return (
     <>
       <motion.div
         initial={{ opacity: 0, scale: 0.9, y: 20 }}
         animate={{ opacity: 1, scale: 1, y: 0 }}
         transition={{ type: 'spring', stiffness: 500, damping: 30 }}
         className={cn('flex group', isSent ? 'justify-end' : 'justify-start')}
         onContextMenu={handleContextMenu}
         onClick={handleContextMenu}
       >
      <div className={cn('max-w-[70%] relative', isSent ? 'items-end' : 'items-start')}>
        {!isSent && conversation?.isGroup && sender && (
          <p className="text-xs text-primary font-medium mb-1 ml-3">{sender.name}</p>
        )}
        
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={cn(
            'px-4 py-2.5 rounded-2xl relative',
            isSent
              ? 'message-sent text-primary-foreground rounded-br-md'
              : 'message-received text-foreground rounded-bl-md'
          )}
        >
          {/* Quoted Reply Section */}
          {message.replyToMessage && (
            <div
              className={cn(
                'mb-2 p-2 rounded-lg border-l-2',
                isSent
                  ? 'bg-white/10 border-white/40'
                  : 'bg-primary/10 border-primary/40'
              )}
            >
              <p
                className={cn(
                  'text-xs font-medium mb-0.5',
                  isSent ? 'text-primary-foreground/80' : 'text-primary'
                )}
              >
                {message.replyToMessage.senderName}
              </p>
              <p
                className={cn(
                  'text-xs line-clamp-2',
                  isSent ? 'text-primary-foreground/60' : 'text-muted-foreground'
                )}
              >
                {message.replyToMessage.content.length > 80
                  ? `${message.replyToMessage.content.slice(0, 80)}...`
                  : message.replyToMessage.content}
              </p>
            </div>
          )}
          
          {message.type === 'voice' && message.voiceDuration ? (
            <VoiceMessage duration={message.voiceDuration} isSent={isSent} />
          ) : (
            <p className="text-sm leading-relaxed break-words">{message.content}</p>
          )}
          
          <div
            className={cn(
              'flex items-center gap-1 mt-1',
              isSent ? 'justify-end' : 'justify-start'
            )}
          >
            <span
              className={cn(
                'text-[10px] transition-opacity',
                isSent ? 'text-primary-foreground/70' : 'text-muted-foreground',
                showTimestamp ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              )}
            >
              {format(new Date(message.timestamp), 'HH:mm')}
            </span>
            
            {isSent && (
              <span className="text-primary-foreground/70">
                {message.read ? (
                  <CheckCheck className="w-3.5 h-3.5" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
              </span>
            )}
          </div>
        </motion.div>
         
         {/* Reactions */}
         {message.reactions && message.reactions.length > 0 && (
           <motion.div
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             className={cn(
               'flex gap-0.5 mt-1',
               isSent ? 'justify-end mr-2' : 'justify-start ml-2'
             )}
           >
             {message.reactions.map((emoji, idx) => (
               <span
                 key={idx}
                 className="text-sm bg-glass-border/30 rounded-full px-1.5 py-0.5"
               >
                 {emoji}
               </span>
             ))}
           </motion.div>
         )}
      </div>
    </motion.div>
       
       <MessageContextMenu
         isOpen={showContextMenu}
         position={contextMenuPosition}
         onClose={() => setShowContextMenu(false)}
         onReact={(emoji) => addReaction(message.id, emoji)}
         onReply={() => setReplyTo(message)}
         onDelete={() => setShowDeleteModal(true)}
         onPin={() => setPinnedMessage(message)}
         isSentByMe={isSent}
       />
       
       <DeleteMessageModal
         isOpen={showDeleteModal}
         onClose={() => setShowDeleteModal(false)}
         onConfirm={() => {
           deleteMessage(message.id);
           setShowDeleteModal(false);
         }}
       />
     </>
  );
};

export default MessageBubble;
