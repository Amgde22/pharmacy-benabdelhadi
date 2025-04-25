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

// Define enums for cleaner schema and type safety based on YAML options
const clothingTypes = z.enum(["T-Shirt", "Hoodie", "Sweatshirt", "Jeans", "Pants", "Shorts", "Jacket", "Dress", "Skirt", "Accessory"]);
const clothingTags = z.enum(["Men", "Women", "Unisex", "Kids", "New Arrival", "Sale", "Basic", "Summer", "Winter", "Spring", "Fall"]);
const clothingSizes = z.enum(["XS", "S", "M", "L", "XL", "XXL", "One Size"]);
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
      type: clothingTypes, // ✅ Clothing Type (using enum)
      price: z.number().min(0), // ✅ Base Price (DZD)
      offer: z.number().min(0).optional(), // ❓ Base Price Before Discount (DZD)
      // Note: Removed the top-level 'image' field as it wasn't in your provided YAML snippet.
      // If you *do* have a main product image separate from variants, add it back:
      // image: image(), // ✅ Main Image (for listing)
      tags: z.array(clothingTags).optional(), // 🔹❓ Tags (using enum)

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
          available_sizes: z.array(clothingSizes) // 🔹✅ Available Sizes (select multiple)
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
  pcs: pcsCollection
};