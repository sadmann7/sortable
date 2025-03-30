export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Sortable",
  description: "Sortable built with shadcn/ui, radix ui, and dnd-kit",
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://sortable.sadmn.com",
  links: { github: "https://github.com/sadmann7/sortable" },
};
