import { SITE_URL } from "~/consts";

// Norven is a fictional architecture studio used as a portfolio demonstration.
// SITE carries the studio's in-fiction identity — email and phone are intentionally
// non-deliverable placeholders so the demo never falsely advertises the author's real
// address as a studio endpoint. The real, deliverable contact lives in AUTHOR below
// and is surfaced only on the /colophon page.
export const SITE = {
  name: "Norven",
  tagline: "Architecture of consequence.",
  description:
    "Norven is an architecture practice working on residences, cultural buildings, and landscapes across Northern Europe and beyond.",
  url: SITE_URL,
  email: "studio@norven.example",
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

// Real author of this portfolio. Surfaced only on /colophon (and through the
// <meta name="portfolio-of"> + <link rel="author"> in BaseLayout).
export const AUTHOR = {
  name: "Farul Ivan",
  email: "farulivan@gmail.com",
  url: "https://github.com/farulivan",
} as const;

export type AuthorData = typeof AUTHOR;
