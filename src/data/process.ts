export type Phase = {
  code: string;
  title: string;
  duration: string;
  description: string;
};

export const PROCESS: readonly Phase[] = [
  {
    code: "01",
    title: "Listen",
    duration: "4–8 weeks",
    description:
      "On site, in your daily routine, in the archive. We do not draw in this phase. We measure, photograph, and write.",
  },
  {
    code: "02",
    title: "Sketch",
    duration: "6–10 weeks",
    description:
      "First massing and section studies. Up to four alternates presented; one carried forward by joint decision. Quantity-surveyed early so cost is a parameter, not a surprise.",
  },
  {
    code: "03",
    title: "Draw",
    duration: "20–36 weeks",
    description:
      "Construction documentation, permit submissions, tender preparation. Every joint detailed at 1:5 minimum. Contractor selected by closed tender with three vetted firms.",
  },
  {
    code: "04",
    title: "Build",
    duration: "52–130 weeks",
    description:
      "Weekly site presence by the project architect through completion. A twelve-month post-occupancy review is included as standard.",
  },
] as const;
