import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Mic, MicOff, Volume2, VolumeX, PhoneOff } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AuroraBackground from '@/components/chat/AuroraBackground';
import { cn } from '@/lib/utils';

const VoiceCall: React.FC = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const { conversations, getOtherParticipant } = useChat();
  
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [duration, setDuration] = useState(0);

  const conversation = conversations.find((c) => c.id === conversationId);
  const otherUser = conversation ? getOtherParticipant(conversation) : null;

  useEffect(() => {
    // Simulate call connecting after 3 seconds
    const timeout = setTimeout(() => {
      setCallStatus('connected');
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => navigate(-1), 2000);
  };

  if (!otherUser) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AuroraBackground />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        {/* Avatar with glow */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          className="relative mb-8"
        >
          <motion.div
            animate={{
              boxShadow: callStatus === 'connected' 
                ? ['0 0 60px 20px hsl(var(--primary) / 0.3)', '0 0 80px 30px hsl(var(--primary) / 0.2)', '0 0 60px 20px hsl(var(--primary) / 0.3)']
                : '0 0 40px 10px hsl(var(--primary) / 0.2)',
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="rounded-full"
          >
            <Avatar className="w-40 h-40 ring-4 ring-primary/30">
              <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
              <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-accent">
                {otherUser.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </motion.div>

          {/* Ripple effect when ringing */}
          {callStatus === 'ringing' && (
            <>
              <motion.div
                animate={{ scale: [1, 2], opacity: [0.4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 rounded-full border-2 border-primary"
              />
              <motion.div
                animate={{ scale: [1, 2], opacity: [0.4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
                className="absolute inset-0 rounded-full border-2 border-primary"
              />
            </>
          )}
        </motion.div>

        {/* Name and Status */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-foreground mb-2"
        >
          {otherUser.name}
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={cn(
            'text-lg mb-8',
            callStatus === 'connected' ? 'text-green-400' : 'text-muted-foreground'
          )}
        >
          {callStatus === 'ringing' && 'Calling...'}
          {callStatus === 'connected' && formatDuration(duration)}
          {callStatus === 'ended' && `Call ended • ${formatDuration(duration)}`}
        </motion.p>

        {/* Controls */}
        {callStatus !== 'ended' && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-6"
          >
            {/* Mute Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMuted(!isMuted)}
              className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center transition-all',
                isMuted ? 'bg-destructive/30 text-destructive' : 'glass text-foreground'
              )}
            >
              {isMuted ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            </motion.button>

            {/* End Call Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleEndCall}
              className="w-20 h-20 rounded-full bg-destructive flex items-center justify-center shadow-lg shadow-destructive/30"
            >
              <PhoneOff className="w-8 h-8 text-white" />
            </motion.button>

            {/* Speaker Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center transition-all',
                !isSpeakerOn ? 'bg-muted/50 text-muted-foreground' : 'glass text-foreground'
              )}
            >
              {isSpeakerOn ? <Volume2 className="w-7 h-7" /> : <VolumeX className="w-7 h-7" />}
            </motion.button>
          </motion.div>
        )}

        {/* Call Ended State */}
        {callStatus === 'ended' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <p className="text-muted-foreground">Returning to chat...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VoiceCall;
