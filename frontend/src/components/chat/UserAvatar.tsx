import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatusIndicator from "./StatusIndicator";
import { User } from "@/types/chat";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg" | "xl";
  showStatus?: boolean;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = "md",
  showStatus = true,
  className,
}) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const statusPositions = {
    sm: "-bottom-0.5 -right-0.5",
    md: "-bottom-0.5 -right-0.5",
    lg: "bottom-0 right-0",
    xl: "bottom-0.5 right-0.5",
  };

  const statusSizes = {
    sm: "sm" as const,
    md: "sm" as const,
    lg: "md" as const,
    xl: "lg" as const,
  };

  // FIXED: Handle null/undefined name
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <motion.div
      className={cn("relative inline-block", className)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Avatar className={cn(sizeClasses[size], "ring-2 ring-glass-border/30")}>
        <AvatarImage src={user.avatar} alt={user.name || "User"} />
        <AvatarFallback className="bg-secondary text-secondary-foreground">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      {showStatus && (
        <span
          className={cn(
            "absolute border-2 border-background rounded-full",
            statusPositions[size],
          )}
        >
          <StatusIndicator status={user.status} size={statusSizes[size]} />
        </span>
      )}
    </motion.div>
  );
};

export default UserAvatar;
