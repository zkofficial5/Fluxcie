import React, { useState, useEffect, useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, 
  RefreshCw, Monitor, Signal 
} from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const VideoCall: React.FC = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const { conversations, getOtherParticipant, currentUser } = useChat();
  const dragControls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement>(null);
  
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const conversation = conversations.find((c) => c.id === conversationId);
  const otherUser = conversation ? getOtherParticipant(conversation) : null;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCallStatus('connected');
    }, 2000);
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

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls && callStatus === 'connected') {
      timeout = setTimeout(() => setShowControls(false), 5000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, callStatus]);

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
    <div 
      ref={constraintsRef}
      className="min-h-screen relative overflow-hidden bg-background"
      onClick={() => setShowControls(true)}
    >
      {/* Main Video (Other Person) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* Simulated video with avatar and animated gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Avatar className="w-48 h-48">
              <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
              <AvatarFallback className="text-6xl bg-gradient-to-br from-primary to-accent">
                {otherUser.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Top Bar */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: showControls ? 0 : -100, opacity: showControls ? 1 : 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="absolute top-0 left-0 right-0 z-20 p-4 glass"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 ring-2 ring-white/20">
              <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
              <AvatarFallback>{otherUser.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{otherUser.name}</h3>
              <p className={cn(
                'text-sm',
                callStatus === 'connected' ? 'text-green-400' : 'text-muted-foreground'
              )}>
                {callStatus === 'ringing' && 'Connecting...'}
                {callStatus === 'connected' && formatDuration(duration)}
                {callStatus === 'ended' && 'Call ended'}
              </p>
            </div>
          </div>

          {/* Connection Quality */}
          <div className="flex items-center gap-2">
            <Signal className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400">Excellent</span>
          </div>
        </div>
      </motion.div>

      {/* Self View (PiP) */}
      <motion.div
        drag
        dragControls={dragControls}
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        whileDrag={{ scale: 1.05 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute bottom-28 right-4 w-32 h-48 rounded-2xl overflow-hidden glass-strong shadow-2xl cursor-move z-30"
      >
        {isVideoOn ? (
          <div className="w-full h-full bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center">
            <Avatar className="w-16 h-16">
              <AvatarImage src={currentUser.avatar} alt="You" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent">
                {currentUser.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <VideoOff className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
      </motion.div>

      {/* Bottom Controls */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: showControls ? 0 : 100, opacity: showControls ? 1 : 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="absolute bottom-0 left-0 right-0 z-20 p-6 glass"
      >
        <div className="flex items-center justify-center gap-4">
          {/* Flip Camera */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsFrontCamera(!isFrontCamera)}
            className="w-14 h-14 rounded-full glass flex items-center justify-center"
          >
            <RefreshCw className={cn('w-6 h-6', !isFrontCamera && 'rotate-180')} />
          </motion.button>

          {/* Video Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={cn(
              'w-14 h-14 rounded-full flex items-center justify-center transition-all',
              !isVideoOn ? 'bg-destructive/30 text-destructive' : 'glass text-foreground'
            )}
          >
            {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </motion.button>

          {/* Mute Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMuted(!isMuted)}
            className={cn(
              'w-14 h-14 rounded-full flex items-center justify-center transition-all',
              isMuted ? 'bg-destructive/30 text-destructive' : 'glass text-foreground'
            )}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </motion.button>

          {/* End Call */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleEndCall}
            className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center shadow-lg shadow-destructive/30"
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </motion.button>

          {/* Screen Share */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full glass flex items-center justify-center"
          >
            <Monitor className="w-6 h-6" />
          </motion.button>
        </div>
      </motion.div>

      {/* Ringing Overlay */}
      {callStatus === 'ringing' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 bg-background/80 backdrop-blur-lg flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Avatar className="w-32 h-32 mx-auto mb-6 ring-4 ring-primary/30">
                <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-accent">
                  {otherUser.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{otherUser.name}</h2>
            <p className="text-muted-foreground">Connecting video call...</p>
          </div>
        </motion.div>
      )}

      {/* Ended Overlay */}
      {callStatus === 'ended' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-40 bg-background/80 backdrop-blur-lg flex items-center justify-center"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Call Ended</h2>
            <p className="text-muted-foreground">Duration: {formatDuration(duration)}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VideoCall;
