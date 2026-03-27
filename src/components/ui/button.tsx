import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        ctaGold: "bg-gradient-to-br from-primary to-[hsl(43,85%,45%)] text-charcoal-deep font-semibold rounded-full text-base tracking-wide uppercase hover:scale-105 hover:from-white hover:to-primary shadow-[0_0_4px_hsla(43,85%,58%,0.6),0_0_16px_hsla(43,85%,58%,0.4)] hover:shadow-[0_0_20px_hsla(43,85%,58%,0.7),0_0_40px_hsla(43,85%,58%,0.4)] transition-all duration-400",
        ctaDark: "bg-transparent text-primary border-2 border-primary font-semibold rounded-full text-base tracking-wide uppercase hover:scale-105 hover:bg-primary hover:text-charcoal-deep shadow-[0_0_10px_hsla(43,85%,58%,0.2)] hover:shadow-[0_0_16px_hsla(43,85%,58%,0.5),0_0_30px_hsla(43,85%,58%,0.3)] transition-all duration-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        cta: "h-auto px-10 py-4",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
