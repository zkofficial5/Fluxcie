import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Send, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
  onCancel: () => void;
  onSend: (duration: number) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isRecording,
  onStart,
  onStop,
  onCancel,
  onSend,
}) => {
  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [waveformValues, setWaveformValues] = useState<number[]>(Array(20).fill(0.3));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const waveformIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      waveformIntervalRef.current = setInterval(() => {
        setWaveformValues(
          Array(20)
            .fill(0)
            .map(() => 0.2 + Math.random() * 0.8)
        );
      }, 100);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (waveformIntervalRef.current) clearInterval(waveformIntervalRef.current);
    };
  }, [isRecording, isPaused]);

  useEffect(() => {
    if (!isRecording) {
      setDuration(0);
      setIsPaused(false);
      setWaveformValues(Array(20).fill(0.3));
    }
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = () => {
    onSend(duration);
    setDuration(0);
  };

  return (
    <AnimatePresence>
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute inset-x-0 bottom-0 p-4 glass-strong rounded-2xl mx-2 mb-2"
        >
          <div className="flex items-center gap-4">
            {/* Cancel Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onCancel}
              className="p-3 rounded-full bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Recording Indicator & Timer */}
            <div className="flex items-center gap-3 flex-1">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-3 h-3 rounded-full bg-destructive"
              />
              <span className="text-sm font-medium text-foreground tabular-nums">
                {formatTime(duration)}
              </span>

              {/* Waveform */}
              <div className="flex-1 flex items-center gap-0.5 h-8 px-2">
                {waveformValues.map((value, index) => (
                  <motion.div
                    key={index}
                    className="flex-1 bg-primary rounded-full max-w-1"
                    animate={{ height: `${value * 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                ))}
              </div>
            </div>

            {/* Pause/Resume Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPaused(!isPaused)}
              className="p-3 rounded-full bg-glass-border/30 hover:bg-glass-border/50 transition-colors"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </motion.button>

            {/* Send Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              className="p-3 rounded-full gradient-primary text-primary-foreground glow-primary"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Slide to cancel hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-muted-foreground mt-2"
          >
            Click cancel to discard
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceRecorder;
