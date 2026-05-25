import { defineCollection, reference } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "zod";

const projects = defineCollection({
  loader: glob({
    pattern: "*/index.md",
    base: "./src/content/projects",
    generateId: ({ entry }) => entry.split("/")[0]!,
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      year: z.number().int().min(2000).max(2100),
      type: z.enum(["Residence", "Cultural", "Commercial", "Civic", "Landscape"]),
      location: z.string(),
      area: z.string(),
      status: z.enum(["built", "in-studio"]),
      brief: z.string(),
      cover: image().optional(), // OG / grid thumbnail (wired later, see Follow-ups)
      gallery: z
        .array(
          z.object({ src: image().optional(), alt: z.string(), caption: z.string().optional() }),
        )
        .default([]), // alt required → a11y enforced by schema
      monolith: z.object({
        slabCount: z.number().int().min(3).max(20),
        heightUnit: z.number().positive(),
        taper: z.number().min(0).max(1),
        rotation: z.number().default(0),
        accentSlabs: z.array(z.number().int()).default([]),
      }),
      credits: z.array(reference("team")).default([]),
      testimonial: z.object({ quote: z.string(), author: z.string(), role: z.string() }).optional(),
      order: z.number().int(),
      featured: z.boolean().default(false),
    }),
});

const team = defineCollection({
  loader: glob({
    pattern: "*/index.md",
    base: "./src/content/team",
    generateId: ({ entry }) => entry.split("/")[0]!,
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      base: z.enum(["Oslo", "Lisbon", "Kyoto"]),
      portrait: image().optional(),
      bio: z.string(),
      order: z.number().int(),
    }),
});

const awards = defineCollection({
  loader: file("./src/content/awards.yaml"),
  schema: z.object({
    order: z.number().int(),
    year: z.number().int(),
    title: z.string(),
    detail: z.string(),
    project: reference("projects").optional(),
  }),
});

export const collections = { projects, team, awards };
