"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import type * as React from "react";

import { cn } from "@/lib/utils";

export function NavItem({
  href,
  children,
  className,
  ...props
}: React.ComponentPropsWithRef<typeof Link>) {
  const segment = useSelectedLayoutSegment();

  return (
    <Link
      href={href}
      className={cn(
        "text-foreground/60 transition-colors hover:text-foreground",
        href === `/${segment ?? ""}` && "text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
