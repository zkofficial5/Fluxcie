import React from 'react';
import { cn } from '@/lib/utils';
import { UserStatus } from '@/types/chat';

interface StatusIndicatorProps {
  status: UserStatus;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  showPulse = true,
  className,
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const statusClasses = {
    online: 'status-online',
    away: 'status-away',
    offline: 'status-offline',
  };

  return (
    <span
      className={cn(
        'rounded-full inline-block',
        sizeClasses[size],
        statusClasses[status],
        status === 'online' && showPulse && 'pulse-online',
        className
      )}
    />
  );
};

export default StatusIndicator;
