import { defineCollection, z } from 'astro:content';

const words = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    deck: z.string(),
    description: z.string(),
    ogImageAlt: z.string(),
    publishedDate: z.string(),
    updatedDate: z.string().optional(),
    tags: z.array(z.string()).min(1),
    readTime: z.string(),
    wordCount: z.number().int(),
    ogImagePhase: z.string().default('phase26'),
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
  }),
});

export const collections = { words };
