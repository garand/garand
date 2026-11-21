import { cva, type VariantProps } from "cva";
import { forwardRef, cloneElement, isValidElement } from "react";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-400",
        secondary:
          "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
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
