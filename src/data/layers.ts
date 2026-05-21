export type Plate = {
  code: string;
  name: string;
  elevation: string;
  title: string;
  description: string;
};

export const LAYERS: readonly Plate[] = [
  {
    code: "L−08",
    name: "Sub-Grade",
    elevation: "−12.0 m",
    title: "Cisterns and plant",
    description:
      "Rainwater collection, mechanical, three pre-cast cisterns sized for a 1-in-50-year storm event.",
  },
  {
    code: "L−06",
    name: "Foundation",
    elevation: "−8.4 m",
    title: "Pile cap and tie-down",
    description:
      "Sixty-two micropiles into glacial till; post-tensioned cap at −7.2 m. Designed for differential settlement under seasonal frost.",
  },
  {
    code: "L±00",
    name: "Plinth",
    elevation: "±0.0 m",
    title: "Public threshold",
    description:
      "Open colonnade in board-marked concrete. The building does not lock at street level.",
  },
  {
    code: "L+01",
    name: "Atrium",
    elevation: "+4.6 m",
    title: "Daylight void",
    description:
      "A 14-metre vertical slot drawing reflected daylight to the public floor below. Climbing rope plants at all four corners.",
  },
  {
    code: "L+02",
    name: "Studio",
    elevation: "+8.8 m",
    title: "Workrooms and library",
    description:
      "Sixteen single-occupancy workrooms ringing a central reference library. Daylight from three orientations.",
  },
  {
    code: "L+04",
    name: "Garden",
    elevation: "+17.6 m",
    title: "Cultivated terrace",
    description:
      "Native birch and crowberry on 600 mm of engineered soil. Wind-protected by perforated brass screens on the prevailing edge.",
  },
  {
    code: "L+06",
    name: "Residence",
    elevation: "+26.4 m",
    title: "Four guest apartments",
    description:
      "Reserved for visiting researchers. Each apartment opens to a private 18 m² loggia on the north face.",
  },
  {
    code: "L+08",
    name: "Crown",
    elevation: "+35.2 m",
    title: "Observation room",
    description:
      "Twelve radial brass louvres, weather station, public access by appointment. The highest cultural floor in central Reykjavík.",
  },
] as const;
