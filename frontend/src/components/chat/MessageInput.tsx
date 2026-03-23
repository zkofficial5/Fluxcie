import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, Paperclip, Mic } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import AttachmentModal from './AttachmentModal';
import AttachmentPreview, { Attachment } from './AttachmentPreview';
import EmojiPicker from './EmojiPicker';
import VoiceRecorder from './VoiceRecorder';

const MessageInput: React.FC = () => {
  const { sendMessage, sendVoiceMessage, activeConversationId, replyToMessage, setReplyTo } = useChat();
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSendAnimation, setShowSendAnimation] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleAttachmentSelect = (type: 'document' | 'photo' | 'camera' | 'location', file?: File) => {
    if (file) {
      const preview = type === 'photo' ? URL.createObjectURL(file) : undefined;
      setAttachment({
        type,
        file,
        preview,
        name: file.name,
        size: formatFileSize(file.size),
      });
    } else if (type === 'location') {
      setAttachment({
        type,
        name: 'Current Location',
        preview: undefined,
      });
    } else if (type === 'camera') {
      setAttachment({
        type,
        name: 'Camera Photo',
        preview: undefined,
      });
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const handleSend = () => {
    if ((!message.trim() && !attachment) || !activeConversationId) return;
    
    setShowSendAnimation(true);
    setTimeout(() => setShowSendAnimation(false), 300);
    
    // Include attachment info in message if present
    const messageContent = attachment 
      ? `[${attachment.type === 'location' ? '📍 Location' : attachment.type === 'photo' ? '📷 Photo' : '📎 File'}: ${attachment.name}]${message ? '\n' + message : ''}`
      : message;
    
    sendMessage(messageContent, replyToMessage);
    setMessage('');
    setAttachment(null);
    setReplyTo(null);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleVoiceSend = (duration: number) => {
    if (!activeConversationId) return;
    sendVoiceMessage(duration);
    setIsRecording(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="p-4 border-t border-glass-border/30 relative"
    >
      {/* Attachment Preview */}
      <AnimatePresence>
        {attachment && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3"
          >
            <AttachmentPreview
              attachment={attachment}
              onRemove={() => setAttachment(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          boxShadow: isFocused
            ? '0 0 0 2px hsl(var(--primary) / 0.3), 0 10px 40px hsl(var(--primary) / 0.15)'
            : '0 0 0 0px transparent',
        }}
        className="glass-strong rounded-2xl overflow-hidden"
      >
        <div className="flex items-end gap-2 p-2">
          {/* Attachment Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 45 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAttachmentModal(true)}
            className="p-2.5 rounded-xl hover:bg-glass-border/30 transition-colors text-muted-foreground hover:text-primary"
          >
            <Paperclip className="w-5 h-5" />
          </motion.button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type a message..."
              rows={1}
              className="resize-none bg-transparent border-none focus:ring-0 focus-visible:ring-0 min-h-[40px] max-h-[120px] py-2.5 px-1 text-foreground placeholder:text-muted-foreground"
            />
            <AnimatePresence>
              {!message && !attachment && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-2 bottom-2 text-[10px] text-muted-foreground/60"
                >
                  Press Enter to send
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Emoji Button */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={cn(
                'p-2.5 rounded-xl transition-colors',
                showEmojiPicker 
                  ? 'bg-primary/20 text-primary' 
                  : 'hover:bg-glass-border/30 text-muted-foreground hover:text-foreground'
              )}
            >
              <Smile className="w-5 h-5" />
            </motion.button>
            <EmojiPicker
              isOpen={showEmojiPicker}
              onClose={() => setShowEmojiPicker(false)}
              onEmojiSelect={handleEmojiSelect}
            />
          </div>

          {/* Voice/Send Button */}
          <AnimatePresence mode="wait">
            {message.trim() || attachment ? (
              <motion.button
                key="send"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                className={cn(
                  'p-3 rounded-xl gradient-primary text-primary-foreground ripple glow-primary transition-all',
                  showSendAnimation && 'animate-message-pop'
                )}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                key="mic"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -180 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsRecording(true)}
                className="p-3 rounded-xl hover:bg-glass-border/30 transition-colors text-muted-foreground hover:text-primary"
              >
                <Mic className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Attachment Modal */}
      <AttachmentModal
        isOpen={showAttachmentModal}
        onClose={() => setShowAttachmentModal(false)}
        onSelect={handleAttachmentSelect}
      />

      {/* Voice Recorder */}
      <VoiceRecorder
        isRecording={isRecording}
        onStart={() => setIsRecording(true)}
        onStop={() => setIsRecording(false)}
        onCancel={() => setIsRecording(false)}
        onSend={handleVoiceSend}
      />
    </motion.div>
  );
};

export default MessageInput;
