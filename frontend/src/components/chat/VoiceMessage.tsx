import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceMessageProps {
  duration: number;
  isSent: boolean;
}

const VoiceMessage: React.FC<VoiceMessageProps> = ({ duration, isSent }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const waveformData = useRef(
    Array(30)
      .fill(0)
      .map(() => 0.2 + Math.random() * 0.8)
  ).current;

  const actualDuration = Math.max(duration, 1);

  const tick = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const delta = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    setProgress((prev) => {
      const next = prev + (delta / actualDuration) * 100 * playbackSpeed;
      if (next >= 100) {
        setIsPlaying(false);
        return 100;
      }
      return next;
    });

    animFrameRef.current = requestAnimationFrame(tick);
  }, [actualDuration, playbackSpeed]);

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0;
      animFrameRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, tick]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (progress >= 100) setProgress(0);
    setIsPlaying(!isPlaying);
  };

  const cycleSpeed = () => {
    setPlaybackSpeed((prev) => {
      if (prev === 1) return 1.5;
      if (prev === 1.5) return 2;
      return 1;
    });
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * 100;
    setProgress(Math.max(0, Math.min(100, newProgress)));
  };

  const currentTime = (progress / 100) * actualDuration;
  const progressIndex = Math.floor((progress / 100) * waveformData.length);

  return (
    <div className="flex items-center gap-3 min-w-[200px]">
      {/* Play/Pause Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors',
          isSent ? 'bg-white/20 hover:bg-white/30' : 'bg-primary/20 hover:bg-primary/30'
        )}
      >
        {isPlaying ? (
          <Pause className={cn('w-4 h-4', isSent ? 'text-white' : 'text-primary')} />
        ) : (
          <Play className={cn('w-4 h-4 ml-0.5', isSent ? 'text-white' : 'text-primary')} />
        )}
      </motion.button>

      {/* Waveform - clickable to seek */}
      <div
        className="flex-1 flex items-center gap-0.5 h-8 cursor-pointer"
        onClick={handleWaveformClick}
      >
        {waveformData.map((value, index) => (
          <motion.div
            key={index}
            className={cn(
              'flex-1 rounded-full transition-colors duration-150',
              index < progressIndex
                ? isSent
                  ? 'bg-white/80'
                  : 'bg-primary'
                : isSent
                ? 'bg-white/30'
                : 'bg-muted-foreground/30'
            )}
            style={{ height: `${value * 100}%` }}
            animate={
              isPlaying && index === progressIndex
                ? { scaleY: [1, 1.3, 1], transition: { repeat: Infinity, duration: 0.4 } }
                : { scaleY: 1 }
            }
          />
        ))}
      </div>

      {/* Time & Speed */}
      <div className="flex flex-col items-end gap-0.5 shrink-0">
        <span
          className={cn(
            'text-xs tabular-nums',
            isSent ? 'text-white/70' : 'text-muted-foreground'
          )}
        >
          {formatTime(isPlaying || progress > 0 ? currentTime : actualDuration)}
        </span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={cycleSpeed}
          className={cn(
            'text-[10px] px-1.5 py-0.5 rounded-full font-medium transition-colors',
            isSent ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-primary/20 text-primary hover:bg-primary/30'
          )}
        >
          {playbackSpeed}x
        </motion.button>
      </div>
    </div>
  );
};

export default VoiceMessage;
