
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, User } from "lucide-react";

type HeaderProps = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const { toast } = useToast();

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          onClick={() => toast({
            title: "Admin Profile",
            description: "Profile functionality coming soon!"
          })}
        >
          <User size={16} />
          <span>Admin</span>
        </Button>
      </div>
    </header>
  );
}
