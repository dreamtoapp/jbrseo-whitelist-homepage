"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import Link from "@/components/link";
import { getAppUpdatesCount } from "../actions/app-updates";

type SessionType = {
  user: {
    id: string;
    role: "ADMIN" | "CLIENT";
    email?: string | null;
    name?: string | null;
  };
} | null;

type AppUpdatesIconProps = {
  session: SessionType;
};

export function AppUpdatesIcon({ session }: AppUpdatesIconProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (session) {
      getAppUpdatesCount().then(setCount).catch(() => {
        // Silently handle errors, count remains 0
      });
    }
  }, [session]);

  if (!session) {
    return null;
  }

  return (
    <Link
      href="/client"
      className="relative rounded-xl border border-foreground/10 bg-foreground/5 p-2.5 text-foreground/70 transition-all hover:bg-foreground/10 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
      aria-label="تحديثات التطبيق"
    >
      <Bell className="h-4 w-4" />
      <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
        {count > 99 ? "99+" : count}
      </span>
    </Link>
  );
}
