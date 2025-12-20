import * as React from "react";

import { cn } from "@/helpers/utils";

const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("animate-pulse rounded-md bg-foreground/10", className)}
      {...props}
    />
  )
);

Skeleton.displayName = "Skeleton";

export { Skeleton };

