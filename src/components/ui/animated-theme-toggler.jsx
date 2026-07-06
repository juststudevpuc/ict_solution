"use client";

import { useCallback, useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";

export const AnimatedThemeToggler = ({
  className,
  ...props
}) => {
  const buttonRef = useRef(null);
  
  // Connect to our ThemeProvider context brain
  const { theme, setTheme } = useTheme();
  
  // Safely deduce if dark mode is active (accounting for system preferences)
  const isDark = 
    theme === "dark" || 
    (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggleTheme = useCallback(() => {
    const newTheme = isDark ? "light" : "dark";
    
    // 1. Instantly update the HTML element classes for global styling sync
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newTheme);
    }
    
    // 2. Commit the new selection state inside your provider workspace
    setTheme(newTheme);
  }, [isDark, setTheme]);

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(
        "relative flex size-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-all active:scale-95 outline-none",
        className
      )}
      {...props}
    >
      <div className="relative flex size-5 items-center justify-center">
        {/* ☀️ SUN ICON: Standard scale and rotation fade */}
        <Sun
          className={cn(
            "absolute size-full transition-all duration-300 ease-in-out transform",
            isDark 
              ? "scale-0 rotate-90 opacity-0" 
              : "scale-100 rotate-0 opacity-100"
          )}
        />
        
        {/* 🌙 MOON ICON: Standard scale and rotation fade */}
        <Moon
          className={cn(
            "absolute size-full transition-all duration-300 ease-in-out transform",
            isDark 
              ? "scale-100 rotate-0 opacity-100" 
              : "scale-0 -rotate-90 opacity-0"
          )}
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};