export const siteConfig = {
  name: "Flowbit Analytics",
  description: "AI-Powered Analytics Dashboard for Invoice Management",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "LayoutDashboard",
      description: "View analytics and insights",
    },
    {
      title: "Chat with Data",
      href: "/dashboard/chat",
      icon: "MessageSquare",
      description: "Ask questions about your data",
    },
  ],
  links: {
    github: "https://github.com/yourusername/analytics-dashboard",
    docs: "/docs",
  },
};

export type SiteConfig = typeof siteConfig;