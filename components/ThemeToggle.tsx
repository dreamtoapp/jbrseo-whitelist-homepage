"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/helpers/utils";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted] = useState(() => typeof window !== "undefined");

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "rounded-xl border border-foreground/10 bg-foreground/5 p-2.5 text-foreground/70 transition-all hover:bg-foreground/10 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20",
        className
      )}
      aria-label={mounted && isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
    >
      {mounted ? (
        isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
      ) : (
        <span className="h-4 w-4" />
      )}
    </button>
  );
}






