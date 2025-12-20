"use client";

import { useState } from "react";

type CountdownTimerProps = {
  targetDate: Date;
};

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const now = useState(() => Date.now())[0];

  const target = targetDate.getTime();
  const difference = Math.max(0, target - now);

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  const timeUnits = [
    { value: days, label: "أيام", labelEn: "DAYS" },
    { value: hours, label: "ساعات", labelEn: "HOURS" },
  ];

  return (
    <div className="flex items-center justify-center gap-4 py-8">
      {timeUnits.map((unit, index) => (
        <div key={unit.labelEn} className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold text-foreground sm:text-5xl md:text-6xl">
              {formatNumber(unit.value)}
            </div>
            <div className="mt-2 text-sm text-foreground/60">
              {unit.label}
            </div>
          </div>
          {index < timeUnits.length - 1 && (
            <div className="text-2xl text-foreground/30">
              :
            </div>
          )}
        </div>
      ))}
    </div>
  );
}


