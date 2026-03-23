import React, { useState } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  X,
  Search,
  Users,
  MessageCircle,
  Camera,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChat } from "@/context/ChatContext";
import AuroraBackground from "@/components/chat/AuroraBackground";
import UserAvatar from "@/components/chat/UserAvatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const Friends: React.FC = () => {
  const navigate = useNavigate();
  const {
    conversations,
    friends = [], // ← NOW USING REAL FRIENDS FROM API
    setActiveConversation,
    createGroup,
  } = useChat();

  console.log("Friends from context:", friends);
  console.log("Friends length:", friends.length);

  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFriends = searchQuery.trim()
    ? friends.filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : friends;

  const handleMessageFriend = (friendId: string) => {
    const conv = conversations.find(
      (c) => !c.isGroup && c.participants.some((p) => p.id === friendId),
    );
    if (conv) {
      setActiveConversation(conv.id);
      navigate("/");
    }
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleCreateGroup = () => {
    if (!groupName.trim() || selectedMembers.length === 0) return;
    createGroup(groupName.trim(), selectedMembers);
    setShowCreateGroupModal(false);
    setGroupName("");
    setSelectedMembers([]);
    navigate("/");
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
            <h1 className="text-2xl font-bold text-foreground">Friends</h1>
            <p className="text-sm text-muted-foreground">
              {friends.length} friend{friends.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 bg-glass/50 border-glass-border/20 rounded-2xl"
          />
        </div>

        {/* Friends List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-4"
        >
          {filteredFriends.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-glass-border/30 flex items-center justify-center">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No friends match your search"
                  : "No friends yet. Send requests to connect!"}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {filteredFriends.map((friend, index) => (
                  <motion.div
                    key={friend.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, scale: 0.9 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-glass-border/20 hover:bg-glass-border/30 transition-colors"
                  >
                    <UserAvatar user={friend} size="lg" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {friend.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {friend.bio}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleMessageFriend(friend.id)}
                      className="px-3 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-sm font-medium flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* FAB - Create Group */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowCreateGroupModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full gradient-primary shadow-lg glow-primary flex items-center justify-center z-20"
      >
        <Plus className="w-6 h-6 text-primary-foreground" />
      </motion.button>

      {/* Create Group Modal */}
      {ReactDOM.createPortal(
        <AnimatePresence>
          {showCreateGroupModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCreateGroupModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                style={{ zIndex: 9999 }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-0 flex items-center justify-center"
                style={{ zIndex: 10000 }}
                onClick={(e) =>
                  e.target === e.currentTarget && setShowCreateGroupModal(false)
                }
              >
                <div className="glass-strong rounded-2xl p-6 border border-glass-border/30 shadow-2xl mx-4 w-full max-w-md max-h-[80vh] flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      Create Group
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowCreateGroupModal(false)}
                      className="p-2 rounded-lg hover:bg-glass-border/30 transition-colors"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </motion.button>
                  </div>

                  {/* Group Name */}
                  <div className="mb-4">
                    <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                      Group Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter group name..."
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="bg-glass/50 border-glass-border/30 rounded-xl"
                    />
                  </div>

                  {/* Group Avatar Placeholder */}
                  <div className="mb-4 flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-glass-border/30 flex items-center justify-center cursor-pointer hover:bg-glass-border/40 transition-colors border-2 border-dashed border-glass-border/40">
                      <Camera className="w-6 h-6 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Members List */}
                  <div className="mb-4 flex-1 overflow-hidden flex flex-col">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Add Members ({selectedMembers.length} selected)
                    </label>
                    <div className="flex-1 overflow-y-auto space-y-1.5 max-h-48">
                      {friends.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4 text-sm">
                          No friends to add
                        </p>
                      ) : (
                        friends.map((friend) => (
                          <motion.div
                            key={friend.id}
                            whileHover={{ x: 4 }}
                            onClick={() => toggleMember(friend.id)}
                            className="flex items-center gap-3 p-2.5 rounded-xl bg-glass-border/20 hover:bg-glass-border/30 transition-colors cursor-pointer"
                          >
                            <Checkbox
                              checked={selectedMembers.includes(friend.id)}
                              onCheckedChange={() => toggleMember(friend.id)}
                              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <Avatar className="h-8 w-8 ring-1 ring-glass-border/30">
                              <AvatarImage
                                src={friend.avatar}
                                alt={friend.name}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-primary/50 to-accent/50 text-xs">
                                {friend.name.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-foreground truncate">
                              {friend.name}
                            </span>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Create Button */}
                  <Button
                    onClick={handleCreateGroup}
                    disabled={!groupName.trim() || selectedMembers.length === 0}
                    className="w-full rounded-xl gradient-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
                  >
                    Create Group
                  </Button>
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

export default Friends;
