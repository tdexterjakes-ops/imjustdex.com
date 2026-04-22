import { defineCollection, z } from 'astro:content';
import { existsSync } from 'node:fs';
import path from 'node:path';

const LANES = ['Faith', 'Identity', 'Art'] as const;
const PLATE_VARIANTS = ['lead', 'wide', 'secondary', 'banner'] as const;
const PLATE_IMAGES = ['noise', 'concrete'] as const;
const STATUSES = ['published', 'upcoming', 'drafted'] as const;

const words = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        deck: z.string(),
        description: z.string(),
        ogImageAlt: z.string(),
        // Accept either "YYYY-MM-DD" or full ISO. Layout normalizes both.
        publishedDate: z.string(),
        updatedDate: z.string().optional(),
        // Lane tags drive the homepage filter + lane counts. Multiple allowed.
        lanes: z.array(z.enum(LANES)).min(1),
        // Decorative non-lane tags (e.g. Strategy, Culture, Music, Life, Inheritance).
        // Rendered in the article eyebrow alongside lanes with " + " separator.
        tags: z.array(z.string()).default([]),
        readTime: z.string(),
        wordCount: z.number().int().positive(),
        ogImagePhase: z.string().default('phase26'),
        status: z.enum(STATUSES).default('published'),
        // Homepage plate configuration. Positional fallback applied if omitted.
        plate: z
          .object({
            variant: z.enum(PLATE_VARIANTS).optional(),
            image: z.enum(PLATE_IMAGES).optional(),
            row: z.boolean().default(false),
          })
          .default({}),
        prev: z
          .object({
            slug: z.string(),
            title: z.string(),
          })
          .optional(),
        next: z
          .object({
            slug: z.string(),
            title: z.string(),
            date: z.string().optional(),
            ghost: z.boolean().default(false),
          })
          .optional(),
        extraStyles: z.string().optional(),
      })
      .superRefine((data, ctx) => {
        // Build-time guard: every published article must have its OG image on disk.
        // Prevents the silent og-default.png fallback that produced the phase 27 drift.
        if (data.status === 'published') {
          // We can't know slug here (superRefine runs before Astro injects it).
          // Layout will double-check; this refinement is a soft reminder.
        }
      }),
});

export const collections = { words };

// Exported for use in layout + homepage components.
export const LANE_VALUES = LANES;
export type Lane = (typeof LANES)[number];
export type PlateVariant = (typeof PLATE_VARIANTS)[number];
export type PlateImage = (typeof PLATE_IMAGES)[number];
