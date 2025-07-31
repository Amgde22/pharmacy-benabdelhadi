// src/content/config.ts

import { defineCollection, z } from "astro:content";

// Define the 'products' collection
const productsCollection = defineCollection({
  type: 'data',
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      price: z.number().min(0),
      offer: z.number().min(0).optional(),
      image: image(),
      images: z
        .array(
          z.object({
            image: image(),
          })
        )
        .optional(),
      tags: z.union([z.array(z.any()), z.null()]).optional(),
    }),
});

export const collections = {
  products: productsCollection
};