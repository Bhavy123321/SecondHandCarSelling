import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-[42px] w-full rounded-xl border border-border/80 bg-background/50 hover:border-primary/40 focus:border-primary/80 dark:bg-slate-950/40 px-3.5 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm transition-all duration-200",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
