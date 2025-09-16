"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/theme-provider";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon" | "touch" | "touch-icon";
  className?: string;
}

export function ThemeToggle({ 
  variant = "ghost", 
  size = "icon",
  className = ""
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder button during SSR
    return (
      <Button
        variant={variant}
        size={isMobile ? "touch-icon" : size}
        className={`relative transition-all duration-300 hover:scale-110 active:scale-95 touch-manipulation ${className}`}
        disabled
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={isMobile ? "touch-icon" : size}
      onClick={toggleTheme}
      className={`relative transition-all duration-300 hover:scale-110 active:scale-95 touch-manipulation ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Sun 
        className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
          theme === 'light' 
            ? 'rotate-0 scale-100 opacity-100' 
            : 'rotate-90 scale-0 opacity-0'
        }`} 
      />
      <Moon 
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
          theme === 'dark' 
            ? 'rotate-0 scale-100 opacity-100' 
            : '-rotate-90 scale-0 opacity-0'
        }`} 
      />
    </Button>
  );
}