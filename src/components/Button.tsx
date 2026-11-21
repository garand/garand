import { cva, type VariantProps } from "cva";
import { forwardRef, cloneElement, isValidElement } from "react";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-graphite-900 text-white hover:bg-graphite-800 focus:ring-graphite-500 dark:bg-graphite-100 dark:text-graphite-900 dark:hover:bg-graphite-200 dark:focus:ring-graphite-400",
        secondary:
          "border border-graphite-200 bg-white text-graphite-700 hover:bg-graphite-50 focus:ring-blue-500 dark:border-graphite-700 dark:bg-graphite-800 dark:text-graphite-200 dark:hover:bg-graphite-700",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const buttonClasses = twMerge(buttonVariants({ variant }), className);

    if (asChild) {
      if (isValidElement(props.children)) {
        // Filter out button-specific props that shouldn't be passed to child elements
        const { type, disabled, children, ...childProps } = props;
        return cloneElement(props.children, {
          className: twMerge(buttonClasses, (props.children.props as any)?.className),
          ...(props.children.props as any),
          ...childProps,
        });
      }
      return props.children;
    }

    return <button className={buttonClasses} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";
