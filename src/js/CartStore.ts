// src/stores/cart.ts
import { map, computed } from 'nanostores';


// --- Types ---
type sizes = string[]
type color = { name: string, value: string }


// Adjust this based on what your imports/Astro actually provide
export interface ImageObject {
  src: string; // The actual URL/path to the image asset
  width?: number;
  height?: number;
  format?: string; // Example: 'avif', 'webp', 'png' etc. (common in Astro ImageMetadata)
  // Add other properties if needed based on your specific image objects
}

// Represents a single item within the shopping cart
export interface CartItem {
  id: string;
  name: string;
  price: number;
  // Update the image type to accept string (URL) or ImageObject
  image: string | ImageObject;
  quantity: number;
  previousPrice?: number;
  sizes?: sizes;
  color?: color;
}

// The structure of the map store: Record<CartItem['id'], CartItem>
export type CartData = Record<string, CartItem>;

// --- Store Definition ---

export const $cart = map<CartData>({});

// --- Actions ---

const generateCartItemId = (productName: string, sizes?: sizes, color?: color): string => {
  let id = productName;
  if (sizes) id += `-${sizes.join("-")}`;
  if (color) id += `-${color.name.toLowerCase().replace(/\s+/g, '-')}`;
  return id;
};

/**
 * Adds an item to the shopping cart or increases its quantity if it already exists.
 *
 * @param product - Object containing product details to add.
 *                  Image can be a string URL or an ImageObject.
 * @param options - Optional size and color for product variants.
 * @param quantity - Number of items to add (defaults to 1).
 */
export function addItemToCart(
  product: {
    name: string;
    price: number; // Ensure this is the final price (offer or regular)
    // Update the product's image type definition here as well
    previousPrice?:number;
    image: string | ImageObject;
    sizes?: sizes ;
    color?: color;
  },
  quantity: number = 1,

) {
  const cartItemId = generateCartItemId(product.name, product.sizes, product.color)
  const existingEntry = $cart.get()[cartItemId];

  if (existingEntry) {
    $cart.setKey(cartItemId, {
      ...existingEntry,
      quantity: existingEntry.quantity + quantity,
    });
  } else {
    // Create the new item, directly assigning the product.image
    // which could be a string or an ImageObject
    const newItem: CartItem = {
      id: cartItemId,
      name: product.name,
      price: product.price,
      image: product.image, // Assign the image data directly
      quantity: quantity,
      previousPrice:product.previousPrice,
      sizes: product.sizes,
      color: product.color
    };
    $cart.setKey(cartItemId, newItem);
  }
  console.log('Cart updated:', $cart.get());
}

/**
 * Removes an item completely from the cart.
 * @param cartItemId - The unique ID of the cart item to remove.
 */
export function removeItemFromCart(cartItemId: string) {
  $cart.setKey(cartItemId, undefined);
   console.log('Item removed, Cart updated:', $cart.get());
}

/**
 * Updates the quantity of a specific item in the cart.
 * If quantity becomes 0 or less, the item is removed.
 * @param cartItemId - The unique ID of the cart item to update.
 * @param newQuantity - The new quantity for the item.
 */
export function updateItemQuantity(cartItemId: string, newQuantity: number) {
  const existingEntry = $cart.get()[cartItemId];

  if (existingEntry) {
    if (newQuantity > 0) {
      $cart.setKey(cartItemId, {
        ...existingEntry,
        quantity: newQuantity,
      });
    } else {
      removeItemFromCart(cartItemId);
    }
     console.log('Quantity updated, Cart updated:', $cart.get());
  }
}

/**
 * Clears all items from the shopping cart.
 */
export function clearCart() {
  $cart.set({});
  console.log('Cart cleared');
}

// --- Computed Stores (Derived State) ---

export const $cartItems = computed($cart, (cartData) => {
  return Object.values(cartData);
});

export const $totalItems = computed($cart, (cartData) => {
  return Object.values(cartData).reduce((sum, item) => sum + item.quantity, 0);
});

export const $subtotal = computed($cart, (cartData) => {
  const total = Object.values(cartData).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return parseFloat(total.toFixed(2));
});


// --- Helper Function for UI ---
// Place this maybe in a separate utils file or directly in components

/**
 * Utility function to reliably get the image SRC/URL
 * regardless of whether the stored image is a string or an ImageObject.
 * @param image - The image data from the CartItem (string | ImageObject)
 * @returns The image URL string, or a fallback/empty string if invalid.
 */
export function getImageUrl(image: string | ImageObject | undefined | null): string {
    if (!image) {
        return '/placeholder.png'; // Or return empty string ''
    }
    if (typeof image === 'string') {
        return image; // It's already a URL string
    }
    if (typeof image === 'object' && image !== null && typeof image.src === 'string') {
        return image.src; // Extract the src property from the object
    }
    console.warn('Invalid image format encountered in cart item:', image);
    return '/placeholder.png'; // Fallback for unexpected formats
}


addItemToCart({
  name:"xian li pong",
  price:1000,
  previousPrice:1500,
  image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS7GfQ8EduprUTT-34xvrp8gBSNzeJg5Z1Wg&s",
  sizes:["x","xl"],
  color:{name:"red",value:"red"}
},2)
addItemToCart({
  name:"1,2 buckle my shoe",
  price:3000,
  previousPrice:3500,
  image:"https://images.squarespace-cdn.com/content/v1/5ed6e10fb011a123217ba702/1727139534806-K219WNSVFLFTG6QOO2I3/unsplash-image-164_6wVEHfI.jpg",
  sizes:["32"],
  color:{name:"red",value:"red"}
})