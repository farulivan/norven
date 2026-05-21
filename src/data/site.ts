export const SITE = {
  name: "Norven",
  tagline: "Architecture of consequence.",
  description:
    "Norven is an architecture practice working on residences, cultural buildings, and landscapes across Northern Europe and beyond.",
  url: "https://norven.studio",
  email: "studio@norven.studio",
  phone: "+47 22 00 00 00",
  founded: 2009,
  studios: [
    { city: "Oslo", address: "Akersgata 12, 0158", country: "Norway" },
    { city: "Lisbon", address: "Rua das Janelas Verdes 9", country: "Portugal" },
    { city: "Kyoto", address: "Higashiyama, Sanjō 3-15", country: "Japan" },
  ],
  social: {
    instagram: { handle: "norven.studio", url: "https://instagram.com/norven.studio" },
    linkedin: { handle: "norven", url: "https://www.linkedin.com/company/norven" },
  },
  nav: [
    { label: "Work", href: "/projects" },
    { label: "Studio", href: "/studio" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export type SiteData = typeof SITE;
