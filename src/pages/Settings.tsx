import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Camera, Loader2, Save, User } from "lucide-react";

interface UserSettings {
  email: string;
  fullName: string;
  username: string;
  avatarUrl: string;
  bio: string;
}

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock initial user data - replace with actual API call
  const [settings, setSettings] = useState<UserSettings>({
    email: "skier@example.com",
    fullName: "John Doe",
    username: "johndoe",
    avatarUrl: "",
    bio: "Passionate skier and tech enthusiast",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const initials = settings.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleInputChange = (field: keyof UserSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call to your backend
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Saving user settings:", settings);
      console.log("Avatar preview URL:", previewUrl);

      // If there's a new avatar, you would upload it here
      // const formData = new FormData();
      // formData.append('avatar', file);
      // await fetch('/api/users/avatar', { method: 'POST', body: formData });

      // Save other settings
      // await fetch('/api/users/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings),
      // });

      toast({
        title: "Settings saved",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const displayAvatarUrl = previewUrl || settings.avatarUrl;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 flex items-center bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-border/50">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-slate-200 hover:bg-slate-800 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-lg font-semibold text-slate-200">Settings</h1>
        </div>
      </header>

      {/* Content */}
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>User Settings</CardTitle>
                <CardDescription>
                  Manage your account information and preferences
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarImage src={displayAvatarUrl} alt={settings.fullName} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleAvatarClick}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="w-6 h-6 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-lg">{settings.fullName}</h3>
                <p className="text-sm text-muted-foreground">@{settings.username}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAvatarClick}
                  className="mt-3 gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Change Photo
                </Button>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={settings.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-background"
                />
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    @
                  </span>
                  <Input
                    id="username"
                    value={settings.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    placeholder="username"
                    className="pl-8 bg-background"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  This is your unique identifier on Poser
                </p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground">
                  We'll send analysis results and notifications to this email
                </p>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={settings.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us about yourself"
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground">
                  A brief description that appears on your profile
                </p>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="gap-2 min-w-[120px]"
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
