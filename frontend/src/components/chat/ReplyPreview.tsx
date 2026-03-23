 import React from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
 import { X, Reply } from 'lucide-react';
 import { Message } from '@/types/chat';
 
 interface ReplyPreviewProps {
   message: Message | null;
   senderName: string;
   onCancel: () => void;
 }
 
 const ReplyPreview: React.FC<ReplyPreviewProps> = ({ message, senderName, onCancel }) => {
   return (
     <AnimatePresence>
       {message && (
         <motion.div
           initial={{ opacity: 0, y: 20, height: 0 }}
           animate={{ opacity: 1, y: 0, height: 'auto' }}
           exit={{ opacity: 0, y: 20, height: 0 }}
           className="mx-4 mb-2"
         >
           <div className="flex items-center gap-3 p-3 rounded-xl glass border border-glass-border/30">
             <div className="w-1 h-10 rounded-full bg-primary" />
             <Reply className="w-4 h-4 text-primary" />
             <div className="flex-1 min-w-0">
               <p className="text-xs text-primary font-medium">Replying to {senderName}</p>
               <p className="text-sm text-muted-foreground truncate">{message.content}</p>
             </div>
             <motion.button
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
               onClick={onCancel}
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
 
 export default ReplyPreview;