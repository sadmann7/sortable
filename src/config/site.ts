import { env } from "@/env"

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Sortable",
  description: "Sortable component built with dnd kit, shadcn/ui, and radix ui",
  url:
    env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://sortable.sadmn.com",
  links: { github: "https://github.com/sadmann7/sortable" },
}
