import axios from "axios";

// Base URL for Laravel backend
const API_BASE_URL = "http://localhost:8000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Service
export const apiService = {
  // Auth
  register: async (data: {
    name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    const response = await api.post("/register", data);
    if (response.data.token) {
      localStorage.setItem("auth-token", response.data.token);
    }
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post("/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("auth-token", response.data.token);
    }
    return response.data;
  },

  logout: async () => {
    await api.post("/logout");
    localStorage.removeItem("auth-token");
  },

  getCurrentUser: async () => {
    const response = await api.get("/me");
    return response.data.user;
  },

  updateProfile: async (data: any) => {
    const response = await api.put("/profile", data);
    return response.data.user;
  },

  // NEW: Upload profile picture
  uploadProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.post("/profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.user;
  },

  updateStatus: async (status: "online" | "away" | "offline") => {
    const response = await api.put("/status", { status });
    return response.data;
  },

  // Conversations
  getConversations: async () => {
    const response = await api.get("/conversations");
    return response.data.conversations;
  },

  createConversation: async (
    participantIds: number[],
    isGroup: boolean = false,
    groupName?: string,
  ) => {
    const response = await api.post("/conversations", {
      participant_ids: participantIds,
      is_group: isGroup,
      group_name: groupName,
    });
    return response.data.conversation;
  },

  getConversation: async (id: number) => {
    const response = await api.get(`/conversations/${id}`);
    return response.data.conversation;
  },

  muteConversation: async (
    id: number,
    muteType: "hours" | "week" | "forever" | "unmute",
  ) => {
    const response = await api.put(`/conversations/${id}/mute`, {
      mute_type: muteType,
    });
    return response.data.conversation;
  },

  // Messages
  getMessages: async (conversationId: number) => {
    const response = await api.get(`/conversations/${conversationId}/messages`);
    return response.data.messages;
  },

  sendMessage: async (
    conversationId: number,
    content: string,
    type: string = "text",
    replyTo?: number,
  ) => {
    const response = await api.post(
      `/conversations/${conversationId}/messages`,
      {
        content,
        type,
        reply_to: replyTo,
      },
    );
    return response.data.message;
  },

  // NEW: Send voice message
  sendVoiceMessage: async (
    conversationId: number,
    audioBlob: Blob,
    duration: number,
    replyTo?: number,
  ) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "voice-message.webm");
    formData.append("content", `Voice message (${duration}s)`);
    formData.append("type", "voice");
    formData.append("voice_duration", duration.toString());
    if (replyTo) {
      formData.append("reply_to", replyTo.toString());
    }

    const response = await api.post(
      `/conversations/${conversationId}/messages`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data.message;
  },

  // NEW: Send image message
  sendImageMessage: async (
    conversationId: number,
    imageFile: File,
    caption: string = "",
    replyTo?: number,
  ) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("content", caption || `📷 ${imageFile.name}`);
    formData.append("type", "image");
    if (replyTo) {
      formData.append("reply_to", replyTo.toString());
    }

    const response = await api.post(
      `/conversations/${conversationId}/messages`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data.message;
  },

  // NEW: Send file message
  sendFileMessage: async (
    conversationId: number,
    file: File,
    caption: string = "",
    replyTo?: number,
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("content", caption || `📎 ${file.name}`);
    formData.append("type", "file");
    if (replyTo) {
      formData.append("reply_to", replyTo.toString());
    }

    const response = await api.post(
      `/conversations/${conversationId}/messages`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data.message;
  },

  deleteMessage: async (messageId: number) => {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  },

  addReaction: async (messageId: number, emoji: string) => {
    const response = await api.post(`/messages/${messageId}/react`, { emoji });
    return response.data.message;
  },

  markAsRead: async (conversationId: number) => {
    const response = await api.post(
      `/conversations/${conversationId}/mark-read`,
    );
    return response.data;
  },

  // Friends
  getFriends: async () => {
    const response = await api.get("/friends");
    return response.data.friends;
  },

  sendFriendRequest: async (username: string) => {
    const response = await api.post("/friends/request", { username });
    return response.data.friendRequest;
  },

  getSentRequests: async () => {
    const response = await api.get("/friends/requests/sent");
    return response.data.requests;
  },

  getReceivedRequests: async () => {
    const response = await api.get("/friends/requests/received");
    return response.data.requests;
  },

  acceptFriendRequest: async (requestId: number) => {
    const response = await api.post(`/friends/requests/${requestId}/accept`);
    return response.data;
  },

  declineFriendRequest: async (requestId: number) => {
    const response = await api.post(`/friends/requests/${requestId}/decline`);
    return response.data;
  },

  cancelFriendRequest: async (requestId: number) => {
    const response = await api.delete(`/friends/requests/${requestId}`);
    return response.data;
  },

  unfriend: async (friendId: number) => {
    const response = await api.delete(`/friends/${friendId}`);
    return response.data;
  },

  searchUsers: async (query: string) => {
    const response = await api.get("/users/search", {
      params: { query: query },
    });
    return response.data.users || [];
  },

  // Users
  getUsers: async () => {
    const response = await api.get("/users");
    return response.data.users;
  },

  getUserById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data.user;
  },
};

export default api;
