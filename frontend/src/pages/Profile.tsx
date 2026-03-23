import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Loader2, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import AuroraBackground from "@/components/chat/AuroraBackground";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, updateCurrentUser } = useChat();
  const { currentUser: authUser } = useAuth();

  const [formData, setFormData] = useState({
    name: authUser?.name || "",
    username: authUser?.username || "",
    email: authUser?.email || "",
    bio: authUser?.bio || "",
    avatar: authUser?.avatar || "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // Prepare update data
      const updateData: any = {
        name: formData.name,
        bio: formData.bio,
      };

      // Add avatar if changed
      if (previewAvatar) {
        updateData.avatar = previewAvatar;
      }

      // Add password if changing
      if (passwords.new) {
        if (passwords.new !== passwords.confirm) {
          toast.error("New passwords do not match");
          setIsLoading(false);
          return;
        }
        if (passwords.new.length < 6) {
          toast.error("Password must be at least 6 characters");
          setIsLoading(false);
          return;
        }
        updateData.password = passwords.new;
        updateData.password_confirmation = passwords.confirm;
      }

      // Call API to update profile
      await apiService.updateProfile(updateData);

      // Update local context
      updateCurrentUser({
        name: formData.name,
        bio: formData.bio,
        avatar: previewAvatar || formData.avatar,
      });

      toast.success("Profile updated successfully!");

      // Reset password fields
      setPasswords({ current: "", new: "", confirm: "" });
      setPreviewAvatar(null);

      // Navigate back after short delay
      setTimeout(() => navigate("/"), 1000);
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      console.log("Full error:", error.response?.data); // ← ADD THIS LINE
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="relative min-h-screen bg-background">
      <AuroraBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative z-10 min-h-screen"
      >
        {/* Header */}
        <div className="sticky top-0 z-20 glass-strong border-b border-glass-border/30 p-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="p-2 rounded-xl hover:bg-glass-border/30 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </motion.button>
              <h1 className="text-xl font-semibold text-foreground">
                Edit Profile
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto p-6 space-y-8">
          {/* Avatar Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/20"
              >
                <img
                  src={previewAvatar || formData.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 p-3 rounded-full gradient-primary shadow-lg"
              >
                <Camera className="w-5 h-5 text-primary-foreground" />
              </motion.button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Click the camera icon to change photo
            </p>
          </motion.section>

          {/* Profile Info Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-medium text-foreground">
              Profile Information
            </h2>

            <div className="glass rounded-2xl p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="bg-glass border-glass-border/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    className="bg-glass border-glass-border/30"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Username cannot be changed
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="bg-glass border-glass-border/30"
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  className="bg-glass border-glass-border/30 min-h-[100px]"
                />
              </div>
            </div>
          </motion.section>

          {/* Password Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-medium text-foreground">
              Change Password
            </h2>

            <div className="glass rounded-2xl p-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                Leave blank if you don't want to change your password
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input
                    id="new"
                    name="new"
                    type="password"
                    value={passwords.new}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    className="bg-glass border-glass-border/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm Password</Label>
                  <Input
                    id="confirm"
                    name="confirm"
                    type="password"
                    value={passwords.confirm}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    className="bg-glass border-glass-border/30"
                  />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 justify-end pt-4"
          >
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="gap-2 border-glass-border/30 hover:bg-glass-border/30"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="gap-2 gradient-primary hover:opacity-90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
