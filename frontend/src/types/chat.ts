export type UserStatus = 'online' | 'away' | 'offline';

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: UserStatus;
  lastSeen?: Date;
  bio?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'file' | 'voice';
   deleted?: boolean;
   reactions?: string[];
   replyTo?: string;
    replyToMessage?: {
      senderId: string;
      senderName: string;
      content: string;
    };
    voiceDuration?: number;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
   mutedUntil?: Date | null;
   muteType?: 'hours' | 'week' | 'forever' | null;
}

export interface ChatState {
  currentUser: User;
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  isTyping: Record<string, boolean>;
}
