"use client";

import dynamic from "next/dynamic";
import { Newspaper } from "lucide-react";
import Link from "@/components/link";
import { ThemeToggleWrapper } from "@/components/ThemeToggleWrapper";
import { getLaunchDate } from "@/helpers/utils";

const CountdownTimerDrawer = dynamic(
  () => import("@/app/hompage/components/CountdownTimerDrawer").then((mod) => ({ default: mod.CountdownTimerDrawer })),
  {
    ssr: false,
    loading: () => (
      <div className="h-10 w-10 rounded-xl border border-foreground/10 bg-foreground/5" aria-hidden="true" />
    ),
  }
);

const ThemeToggle = dynamic(
  () => import("@/components/ThemeToggleWrapper").then((mod) => ({ default: mod.ThemeToggleWrapper })),
  {
    ssr: false,
    loading: () => (
      <div className="h-10 w-10 rounded-xl border border-foreground/10 bg-foreground/5" aria-hidden="true" />
    ),
  }
);

function NewsLink() {
  return (
    <Link
      href="/news"
      className="rounded-xl border border-foreground/10 bg-foreground/5 p-2.5 text-foreground/70 transition-all hover:bg-foreground/10 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
      aria-label="الأخبار"
    >
      <Newspaper className="h-4 w-4" />
    </Link>
  );
}

export function HomeHeaderActions() {
  const targetDate = getLaunchDate();

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <CountdownTimerDrawer targetDate={targetDate} />
      <NewsLink />
      <ThemeToggle />
    </div>
  );
}



