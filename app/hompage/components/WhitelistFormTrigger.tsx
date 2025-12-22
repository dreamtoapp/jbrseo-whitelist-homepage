"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Zap, ArrowLeft } from "lucide-react";

type WhitelistFormContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const WhitelistFormContext = createContext<WhitelistFormContextType | null>(
  null
);

export function WhitelistFormProvider({
  children,
  open,
  setOpen,
}: {
  children: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <WhitelistFormContext.Provider value={{ open, setOpen }}>
      {children}
    </WhitelistFormContext.Provider>
  );
}

export function useWhitelistForm() {
  const context = useContext(WhitelistFormContext);
  if (!context) {
    throw new Error(
      "useWhitelistForm must be used within WhitelistFormProvider"
    );
  }
  return context;
}

type WhitelistFormTriggerProps = {
  children?: ReactNode;
  className?: string;
  variant?: "default" | "floating";
};

export function WhitelistFormTrigger({
  children,
  className,
  variant = "default",
}: WhitelistFormTriggerProps) {
  const { setOpen } = useWhitelistForm();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Use requestAnimationFrame to avoid forced reflows
      requestAnimationFrame(() => {
        setIsMobile(window.innerWidth < 768);
      });
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleClick = () => {
    if (isMobile) {
      setOpen(true);
    } else {
      // Defer scroll to avoid forced reflow
      requestAnimationFrame(() => {
        const joinSection = document.getElementById("join");
        if (joinSection) {
          joinSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }
  };

  if (variant === "floating") {
    return (
      <Button
        onClick={handleClick}
        className={`flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-l from-primary to-accent py-3.5 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 ${className || ""}`}
      >
        <Zap className="h-5 w-5" />
        <span>سجّل الآن — مجاناً</span>
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      className={`group inline-flex items-center gap-2 rounded-full bg-linear-to-l from-primary to-accent px-8 py-4 text-base font-bold text-primary-foreground shadow-xl shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 ${className || ""}`}
    >
      {children || (
        <>
          <Zap className="h-5 w-5" />
          <span>احجز مكانك الآن — مجاناً</span>
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
        </>
      )}
    </Button>
  );
}






