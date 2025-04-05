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

// Define the 'clothing' collection
const clothingCollection = defineCollection({
  type: 'data',
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string().optional(),
      clothing_type: z.string(),
      price: z.number().min(0),
      offer_price: z.number().min(0).optional(),
      available_colors: z.array(
        z.object({
          name: z.string(),
          value: z.string()
        })
      ),
      available_sizes: z.array(z.string()),
      image: image(),
      additional_images: z
        .array(
          z.object({
            image: image(),
          })
        )
        .optional(),
      tags: z.array(z.string()).optional()
    }),
});

// Define the 'pcs' collection
const pcsCollection = defineCollection({
  type: 'data',
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      price: z.number().min(0),
      offer_price: z.number().min(0).optional(),
      image: image(),
      images: z
        .array(
          z.object({
            image: image(),
          })
        )
        .optional(),
      operating_system: z.string(),
      processor: z.string(),
      graphics_card: z.string(),
      storage: z.string(),
      ram: z.string(),
      motherboard: z.string(),
      description: z.string().optional(),
      tags: z.array(z.string()).optional(),
      warranty: z.string().optional()
    }),
});

export const collections = {
  products: productsCollection,
  clothing: clothingCollection,
  pcs: pcsCollection
};