 import React, { useEffect, useRef } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
 import { Reply, Trash2, Pin, SmilePlus } from 'lucide-react';
 
 interface MessageContextMenuProps {
   isOpen: boolean;
   position: { x: number; y: number };
   onClose: () => void;
   onReact: (emoji: string) => void;
   onReply: () => void;
   onDelete: () => void;
   onPin: () => void;
   isSentByMe: boolean;
 }
 
 const QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];
 
 const MessageContextMenu: React.FC<MessageContextMenuProps> = ({
   isOpen,
   position,
   onClose,
   onReact,
   onReply,
   onDelete,
   onPin,
   isSentByMe,
 }) => {
   const menuRef = useRef<HTMLDivElement>(null);
 
   useEffect(() => {
     const handleClickOutside = (e: MouseEvent) => {
       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
         onClose();
       }
     };
 
     if (isOpen) {
       document.addEventListener('mousedown', handleClickOutside);
     }
 
     return () => document.removeEventListener('mousedown', handleClickOutside);
   }, [isOpen, onClose]);
 
   return (
     <AnimatePresence>
       {isOpen && (
         <motion.div
           ref={menuRef}
           initial={{ opacity: 0, scale: 0.9, y: 10 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.9, y: 10 }}
           style={{
             position: 'fixed',
             left: position.x,
             top: position.y,
             zIndex: 100,
           }}
           className="glass-strong rounded-2xl border border-glass-border/30 shadow-2xl overflow-hidden min-w-[180px]"
         >
           {/* Quick Reactions */}
           <div className="p-2 border-b border-glass-border/30">
             <div className="flex gap-1">
               {QUICK_EMOJIS.map((emoji) => (
                 <motion.button
                   key={emoji}
                   whileHover={{ scale: 1.2 }}
                   whileTap={{ scale: 0.9 }}
                   onClick={() => {
                     onReact(emoji);
                     onClose();
                   }}
                   className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-glass-border/30 text-lg"
                 >
                   {emoji}
                 </motion.button>
               ))}
             </div>
           </div>
 
           {/* Menu Actions */}
           <div className="p-1">
             <motion.button
               whileHover={{ backgroundColor: 'hsl(var(--glass-border) / 0.3)' }}
               onClick={() => {
                 onReply();
                 onClose();
               }}
               className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors"
             >
               <Reply className="w-4 h-4 text-muted-foreground" />
               <span className="text-sm text-foreground">Reply</span>
             </motion.button>
 
             <motion.button
               whileHover={{ backgroundColor: 'hsl(var(--glass-border) / 0.3)' }}
               onClick={() => {
                 onPin();
                 onClose();
               }}
               className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors"
             >
               <Pin className="w-4 h-4 text-muted-foreground" />
               <span className="text-sm text-foreground">Pin message</span>
             </motion.button>
 
             {isSentByMe && (
               <motion.button
                 whileHover={{ backgroundColor: 'hsl(var(--destructive) / 0.1)' }}
                 onClick={() => {
                   onDelete();
                   onClose();
                 }}
                 className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors"
               >
                 <Trash2 className="w-4 h-4 text-destructive" />
                 <span className="text-sm text-destructive">Delete</span>
               </motion.button>
             )}
           </div>
         </motion.div>
       )}
     </AnimatePresence>
   );
 };
 
 export default MessageContextMenu;