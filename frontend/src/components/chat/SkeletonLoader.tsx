import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="flex-1 flex">
      {/* Sidebar Skeleton */}
      <div className="w-80 glass-strong border-r border-glass-border/30 flex flex-col">
        {/* Profile skeleton */}
        <div className="p-4 border-b border-glass-border/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full skeleton" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded skeleton" />
              <div className="h-3 w-1/2 rounded skeleton" />
            </div>
          </div>
        </div>

        {/* Search skeleton */}
        <div className="p-4">
          <div className="h-10 rounded-xl skeleton" />
        </div>

        {/* Conversations skeleton */}
        <div className="flex-1 px-2 space-y-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-3"
            >
              <div className="w-12 h-12 rounded-full skeleton" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded skeleton" />
                <div className="h-3 w-full rounded skeleton" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Area Skeleton */}
      <div className="flex-1 glass-subtle flex flex-col">
        {/* Header skeleton */}
        <div className="p-4 border-b border-glass-border/30 glass">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full skeleton" />
            <div className="space-y-2">
              <div className="h-4 w-32 rounded skeleton" />
              <div className="h-3 w-20 rounded skeleton" />
            </div>
          </div>
        </div>

        {/* Messages skeleton */}
        <div className="flex-1 p-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`h-12 rounded-2xl skeleton ${
                  i % 2 === 0 ? 'w-2/3 rounded-bl-md' : 'w-1/2 rounded-br-md'
                }`}
              />
            </motion.div>
          ))}
        </div>

        {/* Input skeleton */}
        <div className="p-4 border-t border-glass-border/30">
          <div className="h-14 rounded-2xl skeleton" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
