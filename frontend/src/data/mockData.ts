import { User, Conversation, Message } from '@/types/chat';

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: Date;
}

export const currentUser: User = {
  id: 'current-user',
  name: 'Alex Morgan',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  status: 'online',
  bio: 'Full-stack developer & coffee enthusiast ☕',
};

export const users: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    status: 'online',
    bio: 'UX Designer at TechCorp',
  },
  {
    id: 'user-2',
    name: 'Marcus Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    status: 'away',
    lastSeen: new Date(Date.now() - 30 * 60 * 1000),
    bio: 'Backend engineer | Open source contributor',
  },
  {
    id: 'user-3',
    name: 'Emily Williams',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    status: 'online',
    bio: 'Product Manager | Building the future 🚀',
  },
  {
    id: 'user-4',
    name: 'David Park',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    status: 'offline',
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
    bio: 'DevOps specialist',
  },
  {
    id: 'user-5',
    name: 'Team Alpha',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=TeamAlpha',
    status: 'online',
    bio: 'Development Team',
  },
];

// Additional mock users for friend search
export const allUsers: User[] = [
  ...users,
  {
    id: 'user-6',
    name: 'Jessica Liu',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
    status: 'online',
    bio: 'Marketing specialist',
  },
  {
    id: 'user-7',
    name: 'Ryan Thompson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan',
    status: 'away',
    bio: 'Data scientist at StartupXYZ',
  },
  {
    id: 'user-8',
    name: 'Amanda Garcia',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda',
    status: 'offline',
    bio: 'Freelance designer',
  },
  {
    id: 'user-9',
    name: 'Chris Evans',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris',
    status: 'online',
    bio: 'Mobile developer',
  },
  {
    id: 'user-10',
    name: 'Nicole Brown',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nicole',
    status: 'online',
    bio: 'Content creator',
  },
  {
    id: 'user-11',
    name: 'Mike Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    status: 'away',
    bio: 'Startup founder',
  },
  {
    id: 'user-12',
    name: 'Sofia Martinez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia',
    status: 'online',
    bio: 'HR Manager',
  },
  {
    id: 'user-13',
    name: 'James Lee',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    status: 'offline',
    bio: 'Security engineer',
  },
];

// Mock sent requests (current user sent these)
export const sentRequests: FriendRequest[] = [
  {
    id: 'req-1',
    fromUserId: 'current-user',
    toUserId: 'user-6',
    status: 'pending',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'req-2',
    fromUserId: 'current-user',
    toUserId: 'user-7',
    status: 'pending',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'req-3',
    fromUserId: 'current-user',
    toUserId: 'user-8',
    status: 'pending',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

// Mock received requests (other users sent these to current user)
export const receivedRequests: FriendRequest[] = [
  {
    id: 'req-4',
    fromUserId: 'user-9',
    toUserId: 'current-user',
    status: 'pending',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: 'req-5',
    fromUserId: 'user-10',
    toUserId: 'current-user',
    status: 'pending',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
];

export const conversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: [currentUser, users[0]],
    unreadCount: 2,
    isGroup: false,
  },
  {
    id: 'conv-2',
    participants: [currentUser, users[1]],
    unreadCount: 0,
    isGroup: false,
  },
  {
    id: 'conv-3',
    participants: [currentUser, users[2]],
    unreadCount: 5,
    isGroup: false,
  },
  {
    id: 'conv-4',
    participants: [currentUser, users[3]],
    unreadCount: 0,
    isGroup: false,
  },
  {
    id: 'conv-5',
    participants: [currentUser, users[0], users[1], users[2]],
    unreadCount: 12,
    isGroup: true,
    groupName: 'Team Alpha',
    groupAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=TeamAlpha',
  },
];

const createMessage = (
  id: string,
  conversationId: string,
  senderId: string,
  content: string,
  minutesAgo: number,
  read: boolean = true
): Message => ({
  id,
  conversationId,
  senderId,
  content,
  timestamp: new Date(Date.now() - minutesAgo * 60 * 1000),
  read,
  type: 'text',
});

export const messages: Record<string, Message[]> = {
  'conv-1': [
    createMessage('m1-1', 'conv-1', 'user-1', 'Hey Alex! How are you doing today?', 120),
    createMessage('m1-2', 'conv-1', 'current-user', 'Hi Sarah! I\'m doing great, thanks for asking! 😊', 115),
    createMessage('m1-3', 'conv-1', 'user-1', 'I wanted to discuss the new design system we\'re implementing', 110),
    createMessage('m1-4', 'conv-1', 'current-user', 'Sure thing! I\'ve been reviewing the mockups you sent', 105),
    createMessage('m1-5', 'conv-1', 'user-1', 'Perfect! What do you think about the color palette?', 100),
    createMessage('m1-6', 'conv-1', 'current-user', 'I love the purple/blue gradient theme. It feels modern and fresh', 95),
    createMessage('m1-7', 'conv-1', 'user-1', 'That\'s exactly what I was going for! The glassmorphism effects look amazing too', 90),
    createMessage('m1-8', 'conv-1', 'current-user', 'Agreed! When can we schedule a meeting to finalize everything?', 85),
    createMessage('m1-9', 'conv-1', 'user-1', 'How about tomorrow at 2 PM?', 5, false),
    createMessage('m1-10', 'conv-1', 'user-1', 'I\'ll send you the meeting invite shortly!', 2, false),
  ],
  'conv-2': [
    createMessage('m2-1', 'conv-2', 'user-2', 'The API integration is complete!', 300),
    createMessage('m2-2', 'conv-2', 'current-user', 'That\'s awesome news! Any issues during deployment?', 295),
    createMessage('m2-3', 'conv-2', 'user-2', 'None at all. Everything went smoothly', 290),
    createMessage('m2-4', 'conv-2', 'current-user', 'Great work Marcus! The team will be thrilled', 285),
    createMessage('m2-5', 'conv-2', 'user-2', 'Thanks! I\'ve also added comprehensive error handling', 280),
    createMessage('m2-6', 'conv-2', 'current-user', 'You\'re the best! 🙌', 275),
  ],
  'conv-3': [
    createMessage('m3-1', 'conv-3', 'user-3', 'Sprint planning meeting in 10 minutes!', 60),
    createMessage('m3-2', 'conv-3', 'current-user', 'On my way!', 58),
    createMessage('m3-3', 'conv-3', 'user-3', 'Great! We have a lot to cover today', 55),
    createMessage('m3-4', 'conv-3', 'user-3', 'Also, I\'ve updated the product roadmap', 50),
    createMessage('m3-5', 'conv-3', 'current-user', 'Perfect, I\'ll review it right after the meeting', 45),
    createMessage('m3-6', 'conv-3', 'user-3', 'Sounds good! See you soon 👍', 40, false),
    createMessage('m3-7', 'conv-3', 'user-3', 'Don\'t forget to bring your laptop', 35, false),
    createMessage('m3-8', 'conv-3', 'user-3', 'We\'ll need to share screens', 30, false),
    createMessage('m3-9', 'conv-3', 'user-3', 'Also review the new feature specs', 25, false),
    createMessage('m3-10', 'conv-3', 'user-3', 'It\'s going to be an exciting release!', 20, false),
  ],
  'conv-4': [
    createMessage('m4-1', 'conv-4', 'current-user', 'Hey David, is the server migration complete?', 1440),
    createMessage('m4-2', 'conv-4', 'user-4', 'Yes! All services are now running on the new infrastructure', 1430),
    createMessage('m4-3', 'conv-4', 'current-user', 'Excellent! How\'s the performance looking?', 1420),
    createMessage('m4-4', 'conv-4', 'user-4', 'Response times improved by 40%!', 1410),
    createMessage('m4-5', 'conv-4', 'current-user', 'That\'s incredible. Great job on this!', 1400),
  ],
  'conv-5': [
    createMessage('m5-1', 'conv-5', 'user-1', 'Team meeting starts now!', 180),
    createMessage('m5-2', 'conv-5', 'user-2', 'I\'m joining from mobile', 178),
    createMessage('m5-3', 'conv-5', 'current-user', 'Present and ready!', 176),
    createMessage('m5-4', 'conv-5', 'user-3', 'Let\'s discuss the Q1 objectives', 170),
    createMessage('m5-5', 'conv-5', 'user-1', 'I\'ve prepared a presentation', 165),
    createMessage('m5-6', 'conv-5', 'current-user', 'Looking forward to it!', 160),
    createMessage('m5-7', 'conv-5', 'user-2', 'Can we also cover the tech debt items?', 155),
    createMessage('m5-8', 'conv-5', 'user-3', 'Yes, that\'s on the agenda', 150),
    createMessage('m5-9', 'conv-5', 'user-1', 'Great meeting everyone! Summary coming soon', 30, false),
    createMessage('m5-10', 'conv-5', 'user-2', 'Thanks for leading this Sarah!', 25, false),
    createMessage('m5-11', 'conv-5', 'user-3', '🎉 Great teamwork!', 20, false),
    createMessage('m5-12', 'conv-5', 'user-1', 'Next sync is on Friday', 15, false),
  ],
};

// Add last messages to conversations
conversations.forEach(conv => {
  const convMessages = messages[conv.id];
  if (convMessages && convMessages.length > 0) {
    conv.lastMessage = convMessages[convMessages.length - 1];
  }
});
