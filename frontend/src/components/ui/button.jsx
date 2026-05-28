import * as React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = (variant, size, className) => {
  const base =
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 active:scale-[0.97] hover:scale-[1.015] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    default: "premium-gradient text-primary-foreground hover:premium-gradient-hover shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/25",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md shadow-destructive/10 hover:shadow-lg",
    outline:
      "border border-input bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary/80 text-secondary-foreground hover:bg-secondary border border-border/50",
    ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] active:scale-[0.98]",
    link: "text-primary underline-offset-4 hover:underline hover:scale-100 active:scale-100",
  };

  const sizes = {
    default: "h-11 px-5 py-2.5",
    sm: "h-9 rounded-lg px-3.5 text-xs",
    lg: "h-12 rounded-xl px-8 text-base",
    icon: "h-10 w-10 rounded-lg",
  };

  return cn(
    base,
    variants[variant || "default"],
    sizes[size || "default"],
    className,
  );
};

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={buttonVariants(variant, size, className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
