 import React from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
 import { Pin, X } from 'lucide-react';
 import { Message } from '@/types/chat';
 
 interface PinnedMessageBarProps {
   message: Message | null;
   onDismiss: () => void;
 }
 
 const PinnedMessageBar: React.FC<PinnedMessageBarProps> = ({ message, onDismiss }) => {
   return (
     <AnimatePresence>
       {message && (
         <motion.div
           initial={{ opacity: 0, y: -20, height: 0 }}
           animate={{ opacity: 1, y: 0, height: 'auto' }}
           exit={{ opacity: 0, y: -20, height: 0 }}
           className="border-b border-glass-border/30 glass"
         >
           <div className="flex items-center gap-3 px-4 py-2">
             <div className="p-1.5 rounded-lg bg-primary/20">
               <Pin className="w-4 h-4 text-primary" />
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-xs text-primary font-medium">Pinned Message</p>
               <p className="text-sm text-foreground truncate">{message.content}</p>
             </div>
             <motion.button
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
               onClick={onDismiss}
               className="p-1.5 rounded-lg hover:bg-glass-border/30 transition-colors"
             >
               <X className="w-4 h-4 text-muted-foreground" />
             </motion.button>
           </div>
         </motion.div>
       )}
     </AnimatePresence>
   );
 };
 
 export default PinnedMessageBar;