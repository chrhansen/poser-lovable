import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface UserAvatarMenuProps {
  avatarUrl?: string;
  fullName?: string;
  className?: string;
}

export const UserAvatarMenu = ({ 
  avatarUrl, 
  fullName = "User",
  className = "" 
}: UserAvatarMenuProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSettingsClick = () => {
    setOpen(false);
    navigate("/settings");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          className={`relative h-9 w-9 rounded-full p-0 hover:ring-2 hover:ring-primary/20 transition-all ${className}`}
        >
          <Avatar className="h-9 w-9 border-2 border-primary/20">
            <AvatarImage src={avatarUrl} alt={fullName} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-1" align="end" sideOffset={8}>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sm font-medium"
          onClick={handleSettingsClick}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </PopoverContent>
    </Popover>
  );
};
