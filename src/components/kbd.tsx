import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const kbdVariants = cva(
  "select-none rounded border px-1.5 py-px font-mono font-normal text-[0.7rem] shadow-xs disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-foreground",
        outline: "bg-background text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface KbdProps
  extends React.ComponentPropsWithoutRef<"kbd">,
    VariantProps<typeof kbdVariants> {}

function Kbd({ title, children, className, variant, ...props }: KbdProps) {
  return (
    <kbd className={cn(kbdVariants({ variant, className }))} {...props}>
      {title ? (
        <abbr title={title} className="no-underline">
          {children}
        </abbr>
      ) : (
        children
      )}
    </kbd>
  );
}

export { Kbd };
