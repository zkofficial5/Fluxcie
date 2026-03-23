import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="flex items-center gap-2.5 px-5 py-3.5 message-received rounded-2xl rounded-bl-md w-fit"
    >
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent"
            animate={{
              y: [0, -8, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
            style={{
              boxShadow: '0 0 10px hsl(var(--accent) / 0.5)',
            }}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground/80 font-medium">typing</span>
    </motion.div>
  );
};

export default TypingIndicator;
