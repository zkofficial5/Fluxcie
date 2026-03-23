import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  UserPlus,
  X,
  Search,
  Users,
  Clock,
  Check,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChat } from "@/context/ChatContext";
import { apiService } from "@/services/api";
import { toast } from "sonner";
import AuroraBackground from "@/components/chat/AuroraBackground";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Requests: React.FC = () => {
  const navigate = useNavigate();
  const {
    sentRequests,
    receivedRequests,
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    getFriendIds,
    currentUser,
    allUsers,
  } = useChat();

  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const friendIds = getFriendIds();
  const sentRequestUserIds = sentRequests.map((r) => r.toUserId);

  // Search users by username using backend API
  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await apiService.searchUsers(searchQuery.trim());
        setSearchResults(results);
      } catch (error) {
        console.error("Failed to search users:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const getUserById = (userId: string) => allUsers.find((u) => u.id === userId);

  const handleSendRequest = async (username: string) => {
    try {
      await sendFriendRequest(username);
      toast.success("Friend request sent!");
      setSearchQuery("");
      setSearchResults([]);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to send friend request",
      );
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      await cancelFriendRequest(requestId);
      toast.success("Friend request cancelled");
    } catch (error) {
      toast.error("Failed to cancel request");
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
      toast.success("Friend request accepted!");
    } catch (error) {
      toast.error("Failed to accept request");
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      await declineFriendRequest(requestId);
      toast.success("Friend request declined");
    } catch (error) {
      toast.error("Failed to decline request");
    }
  };

  return (
    <div className="min-h-screen relative">
      <AuroraBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl mx-auto p-6"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.1, x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="p-2 rounded-xl glass hover:bg-glass-border/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Friend Requests
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your connections
            </p>
          </div>
        </div>

        {/* Sent Requests Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Sent Requests
            </h2>
            {sentRequests.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full">
                {sentRequests.length}
              </span>
            )}
          </div>

          {sentRequests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-glass-border/30 flex items-center justify-center">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No pending requests</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {sentRequests.map((request) => {
                  const user = getUserById(request.toUserId);
                  if (!user) return null;

                  return (
                    <motion.div
                      key={request.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, scale: 0.9 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-glass-border/20 hover:bg-glass-border/30 transition-colors"
                    >
                      <Avatar className="h-12 w-12 ring-2 ring-glass-border/30">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/50 to-accent/50">
                          {user.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.bio}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 text-xs font-medium bg-accent/20 text-accent rounded-full">
                          Pending
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCancelRequest(request.id)}
                          className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Received Requests Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Received Requests
            </h2>
            {receivedRequests.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full">
                {receivedRequests.length}
              </span>
            )}
          </div>

          {receivedRequests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-glass-border/30 flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No new requests</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {receivedRequests.map((request) => {
                  const user = getUserById(request.fromUserId);
                  if (!user) return null;

                  return (
                    <motion.div
                      key={request.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, scale: 0.9 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-glass-border/20 hover:bg-glass-border/30 transition-colors"
                    >
                      <Avatar className="h-12 w-12 ring-2 ring-glass-border/30">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/50 to-accent/50">
                          {user.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(request.timestamp), "MMM d, h:mm a")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAcceptRequest(request.id)}
                          className="px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors text-sm font-medium flex items-center gap-1"
                        >
                          <Check className="w-4 h-4" />
                          Accept
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeclineRequest(request.id)}
                          className="px-3 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm font-medium"
                        >
                          Decline
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowAddFriendModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full gradient-primary shadow-lg glow-primary flex items-center justify-center z-20"
      >
        <motion.div
          animate={{ rotate: showAddFriendModal ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <UserPlus className="w-6 h-6 text-primary-foreground" />
        </motion.div>
      </motion.button>

      {/* Add Friend Modal */}
      {ReactDOM.createPortal(
        <AnimatePresence>
          {showAddFriendModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddFriendModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                style={{ zIndex: 9999 }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-0 flex items-center justify-center"
                style={{ zIndex: 10000 }}
              >
                <div className="glass-strong rounded-2xl p-6 border border-glass-border/30 shadow-2xl mx-4 w-full max-w-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      Add Friend
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddFriendModal(false)}
                      className="p-2 rounded-lg hover:bg-glass-border/30 transition-colors"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </motion.button>
                  </div>

                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search by username..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-glass border-glass-border/30"
                      autoFocus
                    />
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {isSearching ? (
                      <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                        <p className="text-sm text-muted-foreground mt-2">
                          Searching...
                        </p>
                      </div>
                    ) : searchQuery.trim().length < 2 ? (
                      <p className="text-center text-muted-foreground py-8 text-sm">
                        Type at least 2 characters to search
                      </p>
                    ) : searchResults.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No users found
                      </p>
                    ) : (
                      <AnimatePresence>
                        {searchResults.map((user, index) => {
                          const isFriend = user.isFriend;
                          const hasPendingRequest = user.hasPendingRequest;

                          return (
                            <motion.div
                              key={user.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center gap-3 p-3 rounded-xl bg-glass-border/20 hover:bg-glass-border/30 transition-colors"
                            >
                              <Avatar className="h-10 w-10 ring-2 ring-glass-border/30">
                                <AvatarImage
                                  src={user.avatar}
                                  alt={user.name}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-primary/50 to-accent/50">
                                  {user.name.slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground truncate">
                                  {user.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  @{user.username}
                                </p>
                              </div>
                              {isFriend ? (
                                <span className="px-3 py-1.5 text-xs font-medium bg-primary/20 text-primary rounded-full">
                                  Friends
                                </span>
                              ) : hasPendingRequest ? (
                                <span className="px-3 py-1.5 text-xs font-medium bg-accent/20 text-accent rounded-full">
                                  Requested
                                </span>
                              ) : (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() =>
                                    handleSendRequest(user.username)
                                  }
                                  className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors text-xs font-medium"
                                >
                                  Add Friend
                                </motion.button>
                              )}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
};

export default Requests;
