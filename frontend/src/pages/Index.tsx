import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuroraBackground from '@/components/chat/AuroraBackground';
import Sidebar from '@/components/chat/Sidebar';
import ChatArea from '@/components/chat/ChatArea';
import UserInfoPanel from '@/components/chat/UserInfoPanel';
import SkeletonLoader from '@/components/chat/SkeletonLoader';

const Index: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showUserInfo, setShowUserInfo] = useState(false);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden relative">
      <AuroraBackground />
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex"
          >
            <SkeletonLoader />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-full flex"
          >
            <Sidebar />
            <ChatArea onToggleUserInfo={() => setShowUserInfo(!showUserInfo)} />
            <UserInfoPanel isOpen={showUserInfo} onClose={() => setShowUserInfo(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
