// src/content/config.ts

import { defineCollection, z } from "astro:content";

// Define the 'blog' collection
const blogsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      author: z.string(),
      date: z.date(),
      tags: z.array(z.string()),
      image: image(),
      imageAlt: z.string(),
      body: z.string().optional(),
    }),
});

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
      tags: z.array(z.string()).optional(),
    }),
});

export const collections = {
  blog: blogsCollection,
  products: productsCollection,
};
