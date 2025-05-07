
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  User, 
  FolderPlus, 
  Home, 
  Image, 
  Table
} from "lucide-react";

type SidebarProps = {
  open: boolean;
};

const navItems = [
  { name: "Dashboard", icon: Home, path: "/" },
  { name: "Developers", icon: User, path: "/developers" },
  { name: "Projects", icon: FolderPlus, path: "/projects" },
  { name: "Properties", icon: Table, path: "/properties" },
  { name: "Images", icon: Image, path: "/images" },
];

export function Sidebar({ open }: SidebarProps) {
  const location = useLocation();
  
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-sidebar text-sidebar-foreground z-30 transition-all duration-300 ease-in-out",
        open ? "w-64" : "w-16"
      )}
    >
      <div className="h-16 flex items-center justify-center border-b border-sidebar-border">
        {open ? (
          <h1 className="text-xl font-bold text-sidebar-foreground">Property Palace</h1>
        ) : (
          <h1 className="text-xl font-bold text-sidebar-foreground">PP</h1>
        )}
      </div>
      <nav className="p-2">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Button
                variant="ghost"
                asChild
                className={cn(
                  "w-full justify-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  !open && "justify-center p-2",
                  location.pathname === item.path && "bg-sidebar-accent text-sidebar-primary"
                )}
              >
                <Link to={item.path} className="flex items-center">
                  <item.icon className={cn("h-5 w-5", open && "mr-2")} />
                  {open && <span>{item.name}</span>}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
