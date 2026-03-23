import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image, FileText, Link, Bell, BellOff, ChevronDown, ChevronUp, Volume2, VolumeX, Plus, Shield, User as UserIcon, Search } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import UserAvatar from './UserAvatar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UserInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserInfoPanel: React.FC<UserInfoPanelProps> = ({ isOpen, onClose }) => {
  const { conversations, activeConversationId, getOtherParticipant, currentUser, muteConversation, unmuteConversation, getConversationMuteStatus, getFriendIds, allUsers, addMembersToGroup } = useChat();
  const [showMuteOptions, setShowMuteOptions] = useState(false);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [selectedNewMembers, setSelectedNewMembers] = useState<string[]>([]);
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const otherUser = activeConversation ? getOtherParticipant(activeConversation) : null;
  
  const muteStatus = activeConversationId ? getConversationMuteStatus(activeConversationId) : { muted: false, type: null };

  const sharedMedia = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1634017839464-5c339bbe3c35?w=150&h=150&fit=crop',
  ];

  const sharedLinks = [
    { title: 'Project Documentation', url: 'https://docs.example.com', domain: 'docs.example.com' },
    { title: 'Design System Figma', url: 'https://figma.com/file/abc', domain: 'figma.com' },
    { title: 'API Reference', url: 'https://api.example.com/docs', domain: 'api.example.com' },
  ];

  const sharedDocuments = [
    { name: 'Q1_Report.pdf', size: '2.4 MB', date: 'Jan 15' },
    { name: 'meeting_notes.docx', size: '156 KB', date: 'Feb 3' },
    { name: 'budget_2024.xlsx', size: '890 KB', date: 'Feb 8' },
  ];

  if (!activeConversation) return null;

  const displayName = activeConversation.isGroup
    ? activeConversation.groupName
    : otherUser?.name;

  const isGroup = activeConversation.isGroup;
  const participantIds = activeConversation.participants.map(p => p.id);
  const friendIds = getFriendIds();
  const availableToAdd = allUsers.filter(u => 
    friendIds.includes(u.id) && !participantIds.includes(u.id)
  );

  const toggleNewMember = (id: string) => {
    setSelectedNewMembers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleAddMembers = () => {
    if (activeConversationId && selectedNewMembers.length > 0) {
      addMembersToGroup(activeConversationId, selectedNewMembers);
      setSelectedNewMembers([]);
      setShowAddMembersModal(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="h-full glass-strong border-l border-glass-border/30 overflow-hidden"
          >
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-80 h-full flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-glass-border/30">
                <h3 className="font-semibold text-foreground">{isGroup ? 'Group Info' : 'User Info'}</h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-glass-border/30 transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              </div>

              {/* User/Group Profile */}
              <div className="p-6 text-center border-b border-glass-border/30">
                {isGroup ? (
                  <Avatar className="h-24 w-24 mx-auto ring-4 ring-glass-border/30">
                    <AvatarImage src={activeConversation.groupAvatar} alt={displayName} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/50 to-accent/50 text-2xl">
                      {displayName?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  otherUser && (
                    <div className="flex justify-center">
                      <UserAvatar user={otherUser} size="xl" />
                    </div>
                  )
                )}
                <h2 className="mt-4 text-xl font-semibold text-foreground">{displayName}</h2>
                {!isGroup && otherUser && (
                  <>
                    <p className="text-sm text-muted-foreground mt-1">{otherUser.bio}</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          otherUser.status === 'online'
                            ? 'bg-green-500'
                            : otherUser.status === 'away'
                            ? 'bg-yellow-500'
                            : 'bg-gray-500'
                        }`}
                      />
                      <span className="text-sm text-muted-foreground capitalize">
                        {otherUser.status}
                      </span>
                    </div>
                  </>
                )}
                {isGroup && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeConversation.participants.length} members
                  </p>
                )}
              </div>

              {/* Group Members */}
              {isGroup && (
                <div className="p-4 border-b border-glass-border/30">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-muted-foreground">Members</h4>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddMembersModal(true)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-xs font-medium"
                    >
                      <Plus className="w-3 h-3" />
                      Add
                    </motion.button>
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {activeConversation.participants.map((participant) => {
                      const isAdmin = participant.id === currentUser.id;
                      return (
                        <motion.div
                          key={participant.id}
                          whileHover={{ x: 4 }}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-glass-border/20 cursor-pointer"
                        >
                          <UserAvatar user={participant} size="sm" />
                          <span className="text-sm text-foreground flex-1 truncate">{participant.name}</span>
                          {isAdmin && (
                            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-semibold">
                              <Shield className="w-2.5 h-2.5" />
                              Admin
                            </span>
                          )}
                          {!isAdmin && (
                            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-glass-border/30 text-muted-foreground text-[10px] font-medium">
                              <UserIcon className="w-2.5 h-2.5" />
                              Member
                            </span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Notifications Options */}
              <div className="p-4 border-b border-glass-border/30">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Options</h4>
                <div className="relative">
                  <motion.button
                    whileHover={{ x: showMuteOptions ? 0 : 4 }}
                    onClick={() => setShowMuteOptions(!showMuteOptions)}
                    className={cn(
                      'w-full flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-glass-border/20 text-left transition-colors',
                      muteStatus.muted && 'bg-glass-border/20'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {muteStatus.muted ? (
                        <VolumeX className="w-4 h-4 text-destructive" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-muted-foreground" />
                      )}
                      <div>
                        <span className="text-sm text-foreground">Notifications</span>
                        {muteStatus.muted && (
                          <p className="text-xs text-destructive">
                            {muteStatus.type === 'hours' ? 'Muted for 8 hours' : muteStatus.type === 'week' ? 'Muted for 1 week' : 'Muted'}
                          </p>
                        )}
                      </div>
                    </div>
                    {showMuteOptions ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </motion.button>
                  
                  <AnimatePresence>
                    {showMuteOptions && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="py-2 pl-10 space-y-1">
                          {muteStatus.muted ? (
                            <motion.button
                              whileHover={{ x: 4 }}
                              onClick={() => {
                                if (activeConversationId) unmuteConversation(activeConversationId);
                                setShowMuteOptions(false);
                              }}
                              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-glass-border/20 text-left transition-colors text-sm"
                            >
                              <Bell className="w-3.5 h-3.5 text-primary" />
                              <span className="text-foreground">Unmute notifications</span>
                            </motion.button>
                          ) : (
                            <>
                              <motion.button
                                whileHover={{ x: 4 }}
                                onClick={() => {
                                  if (activeConversationId) muteConversation(activeConversationId, 'hours');
                                  setShowMuteOptions(false);
                                }}
                                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-glass-border/20 text-left transition-colors text-sm"
                              >
                                <BellOff className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-foreground">Mute for 8 hours</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ x: 4 }}
                                onClick={() => {
                                  if (activeConversationId) muteConversation(activeConversationId, 'week');
                                  setShowMuteOptions(false);
                                }}
                                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-glass-border/20 text-left transition-colors text-sm"
                              >
                                <BellOff className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-foreground">Mute for 1 week</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ x: 4 }}
                                onClick={() => {
                                  if (activeConversationId) muteConversation(activeConversationId, 'forever');
                                  setShowMuteOptions(false);
                                }}
                                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-glass-border/20 text-left transition-colors text-sm"
                              >
                                <BellOff className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-foreground">Mute until unmuted</span>
                              </motion.button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Media, Links, Documents Tabs */}
              <div className="flex-1 overflow-y-auto p-4">
                <Tabs defaultValue="media" className="w-full">
                  <TabsList className="w-full bg-glass-border/20 rounded-xl">
                    <TabsTrigger value="media" className="flex-1 text-xs rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <Image className="w-3.5 h-3.5 mr-1" />
                      Media
                    </TabsTrigger>
                    <TabsTrigger value="links" className="flex-1 text-xs rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <Link className="w-3.5 h-3.5 mr-1" />
                      Links
                    </TabsTrigger>
                    <TabsTrigger value="docs" className="flex-1 text-xs rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <FileText className="w-3.5 h-3.5 mr-1" />
                      Docs
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="media">
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {sharedMedia.map((url, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          className="aspect-square rounded-lg overflow-hidden cursor-pointer"
                        >
                          <img src={url} alt={`Shared media ${index + 1}`} className="w-full h-full object-cover" />
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="links">
                    <div className="space-y-2 mt-3">
                      {sharedLinks.map((link, index) => (
                        <motion.a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ x: 4 }}
                          className="flex items-start gap-3 p-3 rounded-xl bg-glass-border/20 hover:bg-glass-border/30 transition-colors block"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Link className="w-4 h-4 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{link.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{link.domain}</p>
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="docs">
                    <div className="space-y-2 mt-3">
                      {sharedDocuments.map((doc, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ x: 4 }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-glass-border/20 hover:bg-glass-border/30 transition-colors cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.size} · {doc.date}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Members Modal (Group only) */}
      {isGroup && ReactDOM.createPortal(
        <AnimatePresence>
          {showAddMembersModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddMembersModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                style={{ zIndex: 9999 }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-0 flex items-center justify-center"
                style={{ zIndex: 10000 }}
                onClick={(e) => e.target === e.currentTarget && setShowAddMembersModal(false)}
              >
                <div className="glass-strong rounded-2xl p-6 border border-glass-border/30 shadow-2xl mx-4 w-full max-w-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Add Members</h3>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddMembersModal(false)}
                      className="p-2 rounded-lg hover:bg-glass-border/30 transition-colors"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </motion.button>
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-1.5 mb-4">
                    {availableToAdd.length === 0 ? (
                      <p className="text-center text-muted-foreground py-6 text-sm">All friends are already in this group</p>
                    ) : (
                      availableToAdd.map(friend => (
                        <motion.div
                          key={friend.id}
                          whileHover={{ x: 4 }}
                          onClick={() => toggleNewMember(friend.id)}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-glass-border/20 hover:bg-glass-border/30 transition-colors cursor-pointer"
                        >
                          <Checkbox
                            checked={selectedNewMembers.includes(friend.id)}
                            onCheckedChange={() => toggleNewMember(friend.id)}
                          />
                          <Avatar className="h-8 w-8 ring-1 ring-glass-border/30">
                            <AvatarImage src={friend.avatar} alt={friend.name} />
                            <AvatarFallback className="bg-gradient-to-br from-primary/50 to-accent/50 text-xs">
                              {friend.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-foreground truncate">{friend.name}</span>
                        </motion.div>
                      ))
                    )}
                  </div>

                  <Button
                    onClick={handleAddMembers}
                    disabled={selectedNewMembers.length === 0}
                    className="w-full rounded-xl gradient-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
                  >
                    Add {selectedNewMembers.length > 0 ? `(${selectedNewMembers.length})` : ''}
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default UserInfoPanel;
