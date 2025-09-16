"use client";

import { Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamically import ThemeToggle to avoid SSR issues
const ThemeToggle = dynamic(() => import("@/components/ui/theme-toggle").then(mod => ({ default: mod.ThemeToggle })), {
  ssr: false,
  loading: () => (
    <Button variant="ghost" size="icon" disabled>
      <div className="h-[1.2rem] w-[1.2rem]" />
    </Button>
  )
});

interface ChatHeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export function ChatHeader({ onMenuClick, sidebarOpen }: ChatHeaderProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <header className="flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:px-6 transition-all duration-200">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size={isMobile ? "touch-icon" : "sm"}
          className="lg:hidden transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
          onClick={onMenuClick}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <Menu className={`h-5 w-5 transition-transform duration-200 ${sidebarOpen ? 'rotate-90' : ''}`} />
        </Button>

        {/* App title */}
        <h1 className="text-lg font-semibold text-foreground lg:text-xl">
          Oration AI Career Counselor
        </h1>
      </div>

      {/* Theme toggle and authentication */}
      <div className="flex items-center gap-2">
        {status === "loading" ? (
          <div className="h-9 w-20 bg-muted animate-pulse rounded" />
        ) : session ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {session.user?.name || session.user?.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => signIn()}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Sign In</span>
          </Button>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}