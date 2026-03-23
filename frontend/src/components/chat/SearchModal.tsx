 import React, { useState, useEffect, useRef } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
 import { Search, X } from 'lucide-react';
 import { useChat } from '@/context/ChatContext';
 import { Input } from '@/components/ui/input';
 import { format } from 'date-fns';
 
 interface SearchModalProps {
   isOpen: boolean;
   onClose: () => void;
 }
 
 const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
   const [searchQuery, setSearchQuery] = useState('');
   const inputRef = useRef<HTMLInputElement>(null);
   const { messages, activeConversationId, conversations, currentUser } = useChat();
 
   const conversationMessages = activeConversationId ? messages[activeConversationId] || [] : [];
   const activeConversation = conversations.find(c => c.id === activeConversationId);
 
   useEffect(() => {
     if (isOpen && inputRef.current) {
       inputRef.current.focus();
     }
     if (!isOpen) {
       setSearchQuery('');
     }
   }, [isOpen]);
 
   const filteredMessages = conversationMessages.filter(msg =>
     msg.content.toLowerCase().includes(searchQuery.toLowerCase())
   );
 
   const highlightText = (text: string, query: string) => {
     if (!query) return text;
     const parts = text.split(new RegExp(`(${query})`, 'gi'));
     return parts.map((part, index) =>
       part.toLowerCase() === query.toLowerCase() ? (
         <span key={index} className="bg-primary/30 text-primary rounded px-0.5">
           {part}
         </span>
       ) : (
         part
       )
     );
   };
 
   const getSenderName = (senderId: string) => {
     if (senderId === currentUser.id) return 'You';
     const sender = activeConversation?.participants.find(p => p.id === senderId);
     return sender?.name || 'Unknown';
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
             initial={{ opacity: 0, y: -20, scale: 0.95 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, y: -20, scale: 0.95 }}
             className="fixed left-1/2 top-20 -translate-x-1/2 z-50 w-full max-w-lg mx-4"
           >
             <div className="glass-strong rounded-2xl border border-glass-border/30 shadow-2xl overflow-hidden">
               {/* Search Header */}
               <div className="p-4 border-b border-glass-border/30">
                 <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                   <Input
                     ref={inputRef}
                     type="text"
                     placeholder="Search in conversation..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-11 pr-10 h-12 bg-glass border-glass-border/30 focus:border-primary/50 rounded-xl"
                   />
                   <button
                     onClick={onClose}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                   >
                     <X className="w-5 h-5" />
                   </button>
                 </div>
               </div>
 
               {/* Search Results */}
               <div className="max-h-80 overflow-y-auto p-2">
                 {searchQuery && filteredMessages.length === 0 && (
                   <div className="text-center py-8 text-muted-foreground">
                     No messages found
                   </div>
                 )}
 
                 {!searchQuery && (
                   <div className="text-center py-8 text-muted-foreground">
                     Type to search messages
                   </div>
                 )}
 
                 <AnimatePresence>
                   {searchQuery && filteredMessages.map((msg, index) => (
                     <motion.div
                       key={msg.id}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -10 }}
                       transition={{ delay: index * 0.05 }}
                       className="p-3 rounded-xl hover:bg-glass-border/20 cursor-pointer transition-colors"
                     >
                       <div className="flex items-center gap-2 mb-1">
                         <span className="text-sm font-medium text-foreground">
                           {getSenderName(msg.senderId)}
                         </span>
                         <span className="text-xs text-muted-foreground">
                           {format(new Date(msg.timestamp), 'MMM d, HH:mm')}
                         </span>
                       </div>
                       <p className="text-sm text-muted-foreground">
                         {highlightText(msg.content, searchQuery)}
                       </p>
                     </motion.div>
                   ))}
                 </AnimatePresence>
               </div>
             </div>
           </motion.div>
         </>
       )}
     </AnimatePresence>
   );
 };
 
 export default SearchModal;