 import React from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
 import { Trash2, X } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 
 interface DeleteMessageModalProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: () => void;
 }
 
 const DeleteMessageModal: React.FC<DeleteMessageModalProps> = ({ isOpen, onClose, onConfirm }) => {
   return (
     <AnimatePresence>
       {isOpen && (
         <>
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={onClose}
             className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
           />
           <motion.div
             initial={{ opacity: 0, scale: 0.9, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.9, y: 20 }}
             className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm"
           >
             <div className="glass-strong rounded-2xl p-6 border border-glass-border/30 shadow-2xl mx-4">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-semibold text-foreground">Delete Message</h3>
                 <button
                   onClick={onClose}
                   className="p-1 rounded-lg hover:bg-glass-border/30 transition-colors"
                 >
                   <X className="w-5 h-5 text-muted-foreground" />
                 </button>
               </div>
               
               <p className="text-muted-foreground mb-6">
                 Are you sure you want to delete this message? This action cannot be undone.
               </p>
               
               <div className="flex gap-3">
                 <Button
                   variant="outline"
                   onClick={onClose}
                   className="flex-1 rounded-xl border-glass-border/30"
                 >
                   Cancel
                 </Button>
                 <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                   <Button
                     onClick={onConfirm}
                     className="w-full rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                   >
                     <Trash2 className="w-4 h-4 mr-2" />
                     Delete
                   </Button>
                 </motion.div>
               </div>
             </div>
           </motion.div>
         </>
       )}
     </AnimatePresence>
   );
 };
 
 export default DeleteMessageModal;