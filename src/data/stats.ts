export type Stat = {
  value: number;
  label: string;
  suffix?: string;
};

export const STATS: readonly Stat[] = [
  { value: 118, label: "Built" },
  { value: 26, label: "In studio" },
  { value: 42, label: "Awards & citations" },
  { value: 17, label: "Years continuous practice" },
] as const;
