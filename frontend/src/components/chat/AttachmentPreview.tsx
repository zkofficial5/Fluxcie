import React from 'react';
import { motion } from 'framer-motion';
import { X, FileText, Image, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Attachment {
  type: 'document' | 'photo' | 'camera' | 'location';
  file?: File;
  preview?: string;
  name: string;
  size?: string;
}

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemove: () => void;
}

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ attachment, onRemove }) => {
  const getIcon = () => {
    switch (attachment.type) {
      case 'photo':
      case 'camera':
        return Image;
      case 'location':
        return MapPin;
      default:
        return FileText;
    }
  };

  const Icon = getIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      className="glass rounded-xl p-3 flex items-center gap-3"
    >
      {/* Thumbnail or Icon */}
      {attachment.preview ? (
        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
          <img
            src={attachment.preview}
            alt={attachment.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className={cn(
          'w-12 h-12 rounded-lg flex items-center justify-center shrink-0',
          attachment.type === 'document' && 'bg-blue-500/20',
          attachment.type === 'photo' && 'bg-purple-500/20',
          attachment.type === 'camera' && 'bg-red-500/20',
          attachment.type === 'location' && 'bg-green-500/20'
        )}>
          <Icon className={cn(
            'w-5 h-5',
            attachment.type === 'document' && 'text-blue-400',
            attachment.type === 'photo' && 'text-purple-400',
            attachment.type === 'camera' && 'text-red-400',
            attachment.type === 'location' && 'text-green-400'
          )} />
        </div>
      )}

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{attachment.name}</p>
        {attachment.size && (
          <p className="text-xs text-muted-foreground">{attachment.size}</p>
        )}
      </div>

      {/* Remove Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onRemove}
        className="p-1.5 rounded-full hover:bg-glass-border/30 transition-colors shrink-0"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </motion.button>
    </motion.div>
  );
};

export default AttachmentPreview;
