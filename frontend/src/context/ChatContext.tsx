import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiService } from "@/services/api";
import { useAuth } from "./AuthContext";
import { User, Message, Conversation } from "@/types/chat";

interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: "pending" | "accepted" | "declined";
  timestamp: Date;
}

interface ChatContextType {
  currentUser: User | null;
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  isTyping: Record<string, boolean>;
  sentRequests: FriendRequest[];
  receivedRequests: FriendRequest[];
  friends: User[];
  setActiveConversation: (id: string | null) => void;
  sendMessage: (
    conversationId: string,
    content: string,
    type?: string,
  ) => Promise<void>;
  sendVoiceMessage: (
    conversationId: string,
    duration: number,
    audioBlob: Blob,
  ) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  addReaction: (messageId: string, emoji: string) => void;
  setReplyTo: (message: Message | null) => void;
  replyToMessage: Message | null;
  setPinnedMessage: (message: Message | null) => void;
  pinnedMessage: Message | null;
  getOtherParticipant: (conversation: Conversation) => User | undefined;
  getConversationMuteStatus: (conversationId: string) => {
    isMuted: boolean;
    muteType: string | null;
  };
  getFriendIds: () => string[];
  allUsers: User[];
  createGroup: (name: string, participantIds: string[]) => Promise<void>;
  updateCurrentUser: (updates: Partial<User>) => void;
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  sendFriendRequest: (userId: string) => Promise<void>;
  cancelFriendRequest: (requestId: string) => Promise<void>;
  acceptFriendRequest: (requestId: string) => Promise<void>;
  declineFriendRequest: (requestId: string) => Promise<void>;
  loadFriendRequests: () => Promise<void>;
  loadFriends: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser: authUser } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isTyping] = useState<Record<string, boolean>>({});
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [pinnedMessage, setPinnedMessage] = useState<Message | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [friendsLoaded, setFriendsLoaded] = useState(false);

  // Convert auth user to chat user format
  useEffect(() => {
    if (authUser) {
      setCurrentUser({
        id: authUser.id.toString(),
        name: authUser.name,
        avatar: authUser.avatar,
        status: authUser.status || "online",
        lastSeen: authUser.last_seen ? new Date(authUser.last_seen) : undefined,
        bio: authUser.bio,
      });
    }
  }, [authUser]);

  // Load all users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await apiService.getUsers();
        setAllUsers(
          users.map((u: any) => ({
            id: u.id.toString(),
            name: u.name,
            avatar: u.avatar,
            status: u.status,
            lastSeen: u.last_seen ? new Date(u.last_seen) : undefined,
            bio: u.bio,
          })),
        );
      } catch (error) {
        console.error("Failed to load users:", error);
      }
    };

    if (authUser) {
      loadUsers();
    }
  }, [authUser]);

  // Load friends from API
  const loadFriends = async () => {
    if (friendsLoaded) return; // Don't reload if already loaded

    try {
      const friendsData = await apiService.getFriends();
      const mappedFriends = friendsData.map((f: any) => ({
        id: f.id.toString(),
        name: f.name,
        avatar:
          f.avatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.username}`,
        status: f.status || "offline",
        lastSeen: f.lastSeen ? new Date(f.lastSeen) : undefined,
        bio: f.bio || "",
      }));

      setFriends(mappedFriends);
      setFriendsLoaded(true);
    } catch (error) {
      console.error("Failed to load friends:", error);
    }
  };

  // Load friends on mount - ONLY ONCE
  useEffect(() => {
    if (authUser && !friendsLoaded) {
      loadFriends();
    }
  }, [authUser]);

  // Load friend requests
  const loadFriendRequests = async () => {
    try {
      const [sent, received] = await Promise.all([
        apiService.getSentRequests(),
        apiService.getReceivedRequests(),
      ]);

      setSentRequests(
        sent.map((r: any) => ({
          id: r.id.toString(),
          fromUserId: r.user?.id?.toString() || "",
          toUserId: r.user?.id?.toString() || "",
          status: r.status,
          timestamp: new Date(r.timestamp),
        })),
      );

      setReceivedRequests(
        received.map((r: any) => ({
          id: r.id.toString(),
          fromUserId: r.user?.id?.toString() || "",
          toUserId: currentUser?.id || "",
          status: r.status,
          timestamp: new Date(r.timestamp),
        })),
      );
    } catch (error) {
      console.error("Failed to load friend requests:", error);
    }
  };

  // Load friend requests on mount
  useEffect(() => {
    if (authUser) {
      loadFriendRequests();
    }
  }, [authUser]);

  // Load conversations
  const loadConversations = async () => {
    try {
      const convos = await apiService.getConversations();

      const formattedConvos: Conversation[] = convos.map((c: any) => ({
        id: c.id?.toString() || "",
        participants: (c.participants || []).map((p: any) => ({
          id: p.id?.toString() || "",
          name: p.name || "",
          avatar: p.avatar || "",
          status: p.status || "offline",
          lastSeen: p.lastSeen ? new Date(p.lastSeen) : undefined,
          bio: p.bio || "",
        })),
        lastMessage: c.lastMessage
          ? {
              id: c.lastMessage.id?.toString() || "",
              conversationId: c.lastMessage.conversationId?.toString() || "",
              senderId: c.lastMessage.senderId?.toString() || "",
              content: c.lastMessage.content || "",
              timestamp: new Date(c.lastMessage.timestamp),
              read: c.lastMessage.read || false,
              type: c.lastMessage.type || "text",
            }
          : undefined,
        unreadCount: c.unreadCount || 0,
        isGroup: c.isGroup || false,
        groupName: c.groupName,
        groupAvatar: c.groupAvatar,
        mutedUntil: c.mutedUntil ? new Date(c.mutedUntil) : undefined,
        muteType: c.muteType,
      }));

      setConversations(formattedConvos);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  // Load messages for a conversation
  const loadMessages = async (conversationId: string) => {
    try {
      const msgs = await apiService.getMessages(Number(conversationId));

      const formattedMessages: Message[] = msgs.map((m: any) => ({
        id: m.id.toString(),
        conversationId: m.conversationId.toString(),
        senderId: m.senderId.toString(),
        content: m.content,
        timestamp: new Date(m.timestamp),
        read: m.read,
        type: m.type,
        deleted: m.deleted,
        reactions: m.reactions || [],
        replyTo: m.replyTo?.toString(),
        replyToMessage: m.replyToMessage
          ? {
              senderId: m.replyToMessage.senderId.toString(),
              senderName: m.replyToMessage.senderName,
              content: m.replyToMessage.content,
            }
          : undefined,
        voiceDuration: m.voiceDuration,
      }));

      setMessages((prev) => ({
        ...prev,
        [conversationId]: formattedMessages,
      }));

      await apiService.markAsRead(Number(conversationId));

      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, unreadCount: 0 } : c,
        ),
      );
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  // Load conversations on mount
  useEffect(() => {
    if (authUser) {
      loadConversations();
    }
  }, [authUser]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversationId) {
      loadMessages(activeConversationId);
    }
  }, [activeConversationId]);

  const setActiveConversation = (id: string | null) => {
    setActiveConversationId(id);
  };

  const sendMessage = async (
    conversationId: string,
    content: string,
    type: string = "text",
  ) => {
    try {
      const newMessage = await apiService.sendMessage(
        Number(conversationId),
        content,
        type,
        replyToMessage ? Number(replyToMessage.id) : undefined,
      );

      const formattedMessage: Message = {
        id: newMessage.id.toString(),
        conversationId: newMessage.conversation_id.toString(),
        senderId: newMessage.sender_id.toString(),
        content: newMessage.content,
        timestamp: new Date(newMessage.created_at),
        read: newMessage.read,
        type: newMessage.type,
        deleted: false,
        reactions: [],
      };

      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), formattedMessage],
      }));

      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, lastMessage: formattedMessage } : c,
        ),
      );

      setReplyToMessage(null);
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  };

  const sendVoiceMessage = async (
    conversationId: string,
    duration: number,
    audioBlob: Blob,
  ) => {
    await sendMessage(conversationId, `Voice message (${duration}s)`, "voice");
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await apiService.deleteMessage(Number(messageId));

      setMessages((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((convId) => {
          updated[convId] = updated[convId].map((msg) =>
            msg.id === messageId ? { ...msg, deleted: true } : msg,
          );
        });
        return updated;
      });
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const addReaction = async (messageId: string, emoji: string) => {
    try {
      await apiService.addReaction(Number(messageId), emoji);

      setMessages((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((convId) => {
          updated[convId] = updated[convId].map((msg) =>
            msg.id === messageId
              ? { ...msg, reactions: [...(msg.reactions || []), emoji] }
              : msg,
          );
        });
        return updated;
      });
    } catch (error) {
      console.error("Failed to add reaction:", error);
    }
  };

  const setReplyTo = (message: Message | null) => {
    setReplyToMessage(message);
  };

  const getOtherParticipant = (
    conversation: Conversation,
  ): User | undefined => {
    if (!currentUser || conversation.isGroup) return undefined;
    return conversation.participants.find((p) => p.id !== currentUser.id);
  };

  const getConversationMuteStatus = (conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation || !conversation.mutedUntil) {
      return { isMuted: false, muteType: null };
    }

    const isMuted = new Date(conversation.mutedUntil) > new Date();
    return {
      isMuted,
      muteType: conversation.muteType || null,
    };
  };

  const getFriendIds = (): string[] => {
    return friends.map((f) => f.id);
  };

  const createGroup = async (name: string, participantIds: string[]) => {
    try {
      await apiService.createConversation(
        participantIds.map((id) => Number(id)),
        true,
        name,
      );

      await loadConversations();
    } catch (error) {
      console.error("Failed to create group:", error);
      throw error;
    }
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  // Friend request functions
  const sendFriendRequest = async (username: string) => {
    try {
      await apiService.sendFriendRequest(username);
      await loadFriendRequests();
    } catch (error) {
      console.error("Failed to send friend request:", error);
      throw error;
    }
  };

  const cancelFriendRequest = async (requestId: string) => {
    try {
      await apiService.cancelFriendRequest(Number(requestId));
      await loadFriendRequests();
    } catch (error) {
      console.error("Failed to cancel friend request:", error);
    }
  };

  const acceptFriendRequest = async (requestId: string) => {
    try {
      await apiService.acceptFriendRequest(Number(requestId));
      await loadFriendRequests();
      setFriendsLoaded(false); // Force reload
      await loadFriends();
      await loadConversations();
    } catch (error) {
      console.error("Failed to accept friend request:", error);
    }
  };

  const declineFriendRequest = async (requestId: string) => {
    try {
      await apiService.declineFriendRequest(Number(requestId));
      await loadFriendRequests();
    } catch (error) {
      console.error("Failed to decline friend request:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        currentUser,
        conversations,
        activeConversationId,
        messages,
        isTyping,
        sentRequests,
        receivedRequests,
        friends,
        setActiveConversation,
        sendMessage,
        sendVoiceMessage,
        deleteMessage,
        addReaction,
        setReplyTo,
        replyToMessage,
        setPinnedMessage,
        pinnedMessage,
        getOtherParticipant,
        getConversationMuteStatus,
        getFriendIds,
        allUsers,
        createGroup,
        updateCurrentUser,
        loadConversations,
        loadMessages,
        sendFriendRequest,
        cancelFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        loadFriendRequests,
        loadFriends,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
