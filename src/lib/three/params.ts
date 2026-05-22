export type MonolithParams = {
  slabCount: number;
  heightUnit: number;
  taper: number;
  rotation: number;
  accentSlabs: readonly number[];
};

export const DEFAULT_MONOLITH: MonolithParams = {
  slabCount: 9,
  heightUnit: 0.6,
  taper: 0.25,
  rotation: 0,
  accentSlabs: [3, 6],
};
