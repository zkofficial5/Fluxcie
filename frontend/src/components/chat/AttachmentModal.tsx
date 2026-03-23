import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Image, Camera, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: 'document' | 'photo' | 'camera' | 'location', file?: File) => void;
}

const attachmentOptions = [
  { id: 'document', icon: FileText, label: 'Document', color: 'from-blue-500 to-blue-600' },
  { id: 'photo', icon: Image, label: 'Photos & Videos', color: 'from-purple-500 to-pink-500' },
  { id: 'camera', icon: Camera, label: 'Camera', color: 'from-red-500 to-orange-500' },
  { id: 'location', icon: MapPin, label: 'Location', color: 'from-green-500 to-emerald-500' },
] as const;

const AttachmentModal: React.FC<AttachmentModalProps> = ({ isOpen, onClose, onSelect }) => {
  const handleFileSelect = (type: 'document' | 'photo') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'photo' ? 'image/*,video/*' : '*/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onSelect(type, file);
        onClose();
      }
    };
    input.click();
  };

  const handleOptionClick = (optionId: 'document' | 'photo' | 'camera' | 'location') => {
    if (optionId === 'document' || optionId === 'photo') {
      handleFileSelect(optionId);
    } else {
      onSelect(optionId);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
          >
            <div className="glass-strong rounded-3xl p-6 max-w-lg mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Share</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-glass-border/30 transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {attachmentOptions.map((option, index) => (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOptionClick(option.id)}
                    className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-glass-border/20 transition-colors"
                  >
                    <div className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br',
                      option.color
                    )}>
                      <option.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{option.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AttachmentModal;
