import * as React from "react";
import { cn } from "../../lib/utils";
import { ChevronDown } from "lucide-react";

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        className={cn(
          "flex h-[42px] w-full appearance-none rounded-xl border border-border/80 bg-background/50 hover:border-primary/40 focus:border-primary/80 dark:bg-slate-950/40 px-3.5 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm transition-all duration-200 pr-9",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-55 pointer-events-none text-muted-foreground" />
    </div>
  );
});
Select.displayName = "Select";

export { Select };
