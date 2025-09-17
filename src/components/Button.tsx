import { cva, type VariantProps } from "cva";
import { forwardRef, cloneElement, isValidElement } from "react";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-zinc-900 text-white hover:bg-zinc-800 focus:ring-zinc-500 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:ring-zinc-400",
        secondary:
          "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
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
          className: twMerge(
            buttonClasses,
            (props.children.props as any)?.className,
          ),
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
