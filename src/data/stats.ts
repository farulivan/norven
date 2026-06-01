import { SITE } from "~/data/site";

export type Stat = {
  value: number;
  label: string;
  suffix?: string;
};

// Derived from the founding year so it never goes stale (recomputed each build).
const yearsInPractice = new Date().getFullYear() - SITE.founded;

export const STATS: readonly Stat[] = [
  { value: 118, label: "Built" },
  { value: 26, label: "In studio" },
  { value: 42, label: "Awards & citations" },
  { value: yearsInPractice, label: "Years continuous practice" },
];
