import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles with consistent typography and spacing
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-semibold ring-offset-background transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/50',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary/50',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent/50',
        ghost: 'hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent/50',
        hero: 'bg-gradient-to-r from-pacific-900 to-pacific-600 text-white hover:from-pacific-800 hover:to-pacific-500 shadow-lg hover:shadow-xl focus-visible:ring-pacific-500/50',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/50',
      },
      size: {
        sm: 'h-9 px-3 text-sm font-medium',
        default: 'h-10 px-4 py-2 font-semibold',
        lg: 'h-11 px-8 text-lg font-semibold',
        xl: 'h-12 px-10 text-xl font-semibold',
        icon: 'h-10 w-10 font-semibold',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
