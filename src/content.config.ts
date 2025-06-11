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

const phonesCollection = defineCollection({
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
export const clothingCollection = defineCollection({
  type: 'data',
  schema: ({ image }) =>
    z.object({
      // --- General Product Information ---
      instructions: z.string().optional(), 
      name: z.string(), // ✅ Clothing Name
      description: z.string().optional(), // ❓ Description
      image: image(),
      gender: z.string().optional(), // 🔹❓ Tags (using enum)
      tags: z.array(z.string()).optional(),
      price: z.number().min(0), // ✅ Base Price (DZD)
      offer: z.number().min(0).optional(), // ❓ Base Price Before Discount (DZD)
      
      // --- Color Variants Grouping ---
      variants: z.array( // 🔹✅ Color Variants (list widget)
        z.object({ // Fields for each item in the color_variants list
          // --- Color Definition ---
          color: z.object({ // ✅ Color (object widget)
            name: z.string(), // Color Name (string)
            value: z.string(), // CSS Value (string from color widget)
          }),
          // --- Images for this Color ---
          images: z.array( // 🔹✅ Product Photos (list widget)
            z.object({ // Fields for each item in the images list
              image: image(), // Image (image widget)
            })
          ).min(1), // Require at least one image per color variant
          // --- Sizes for this Color ---
          available_sizes: z.array(z.string()) // 🔹✅ Available Sizes (select multiple)
             .min(1), // Require at least one size per color variant
        })
      ).min(1), // Require at least one color variant for the product
    }),
});

// Define the 'pcs' collection
const pcsCollection = defineCollection({
  type: 'data',
  schema: ({ image }) =>
    z.object({
      name: z.string(),
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
  pcs: pcsCollection,
  phones:phonesCollection
};