export type Service = {
  title: string;
  description: string;
  iconKey: "compass" | "rule" | "leaf" | "book";
};

export const SERVICES: readonly Service[] = [
  {
    title: "Architecture & Planning",
    description:
      "From single residences to civic-scale buildings. Schematic design through construction administration, with the same team carried from first sketch to final inspection.",
    iconKey: "compass",
  },
  {
    title: "Interior Architecture",
    description:
      "Joinery, lighting, and material assemblies designed at 1:1. We work in long-life timbers, cast stone, brass, and waxed plaster. No proprietary systems unless we cannot avoid them.",
    iconKey: "rule",
  },
  {
    title: "Landscape & Terrain",
    description:
      "Site work as a primary medium. Drainage, planting succession, ground modelling, and the patient negotiation between building footprint and existing topography.",
    iconKey: "leaf",
  },
  {
    title: "Research & Publication",
    description:
      "An ongoing studio practice of writing and built-history research. Three monographs published since 2016; quarterly studio notes available on request.",
    iconKey: "book",
  },
] as const;
