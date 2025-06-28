<template>
  <sl-drawer
    ref="drawer"
    :label="`Your Cart (${totalItems})`"
    placement="end"
    class="cart-drawer"
    :class="{
      // 'sl-theme-dark': darkThemeActive // Or however you apply dark theme
    }"
    :open="isOpen"
    @sl-hide="handleCloseIntent"
  >
    <!-- Empty Cart Message (remains the same) -->
    <div v-if="items.length === 0" class="empty-cart-message">
       <sl-icon name="cart-x" style="font-size: 3rem; margin-bottom: 1rem;"></sl-icon>
      <!-- Your cart is empty. Add some items to get started! -->
      Your cart is empty. Add some items to get started!
    </div>

    <!-- Container for Cart Items -->
    <div ref="cartItemsContainer" v-else class="cart-items-container">
      <!-- Loop and render the new CartItemDisplay component -->
      <CartItemDisplay
        v-for="(item, index) in items"
        :key="item.id"
        :item="item"
        :index="index"
        @increase-quantity="handleIncreaseQuantity"
        @decrease-quantity="handleDecreaseQuantity"
        @remove-item="handleRemoveItem"
      />
      <!-- The complex grid HTML that was here before is now inside CartItemDisplay -->
    </div>

    <!-- Footer (remains the same) -->
    <div slot="footer" class="cart-footer">
        <div v-if="items.length > 0" class="subtotal">
         <span>Subtotal:</span>
         <!-- Format subtotal here in the parent -->
         <strong>{{ formatCurrency(subtotal, currency) }}</strong>
       </div>
       <sl-button
         href="/checkout"
         class="checkout-btn"
         variant="primary"
         size="large"
         :disabled="items.length === 0"
       >
        Proceed to Checkout
        <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24"><path fill="currentColor" d="m12 10l-1.4-1.4L12.175 7H8V5h4.175l-1.6-1.6L12 2l4 4zM7 22q-.825 0-1.412-.587T5 20t.588-1.412T7 18t1.413.588T9 20t-.587 1.413T7 22m10 0q-.825 0-1.412-.587T15 20t.588-1.412T17 18t1.413.588T19 20t-.587 1.413T17 22M1 4V2h3.275l4.25 9h7l3.9-7H21.7l-4.975 9H8.1L7 15h12v2H3.625L6.6 11.6L3 4z"/></svg>
       </sl-button>
    </div>
  </sl-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'; // Computed might be useful
import { useStore } from '@nanostores/vue';
import { lock, unlock } from 'tua-body-scroll-lock';

// --- Import the new component ---
import CartItemDisplay from './CartItemDisplay.vue'; // Adjust path as needed

// --- Shoelace Imports (only those used directly by the parent) ---
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
// Removed icon-button and tooltip unless used elsewhere in parent

// --- Store Imports (remain the same) ---
import {
  $cartItems,
  $subtotal,
  $totalItems,
  updateItemQuantity,
  removeItemFromCart,
  // getImageUrl is NOT needed here anymore, it's used in CartItemDisplay
  type CartItem
} from '@/js/CartStore'; // Adjust path if needed

// --- Props (remain the same) ---
interface Props {
  currency?: 'DZD' | 'USD' | 'EUR';
}
const props = withDefaults(defineProps<Props>(), {
  currency: 'DZD',
});

// --- State (remains largely the same) ---
const items = useStore($cartItems);
const subtotal = useStore($subtotal);
const totalItems = useStore($totalItems);
const isOpen = ref(document.body.classList.contains('cart'));
const darkThemeActive = ref(false); // Keep theme detection if needed
const drawer = ref<HTMLElement | null>(null);
const cartItemsContainer = ref<HTMLElement | null>(null); // Keep ref for scroll lock

// --- Body Class Sync & Drawer Interaction (remains the same) ---
let observer: MutationObserver | null = null;
onMounted(() => {
  const checkBodyClass = () => {
    const bodyHasCartClass = document.body.classList.contains('cart');
    if (bodyHasCartClass !== isOpen.value) {
       isOpen.value = bodyHasCartClass;
       // Apply/remove scroll lock when drawer opens/closes
       if(isOpen.value && cartItemsContainer.value) {
          lock(cartItemsContainer.value);
       } else if (!isOpen.value && cartItemsContainer.value) {
          unlock(cartItemsContainer.value);
       }
    }
    // Keep dark mode detection if needed
    darkThemeActive.value = document.body.classList.contains('dark-mode');
  };

  checkBodyClass(); // Initial check

  observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        checkBodyClass();
        break; // Only need to check once per mutation batch
      }
    }
  });

  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  // Ensure unlock on unmount if drawer might be open
  if (cartItemsContainer.value) {
      unlock(cartItemsContainer.value);
  }
});

const handleCloseIntent = () => {
    // Delay slightly to allow drawer animation before removing class
    setTimeout(() => {
        if (document.body.classList.contains('cart')) {
            document.body.classList.remove('cart');
            // isOpen should update via the observer, triggering unlock
        }
    }, 50); // Adjust delay if needed
};


// --- Cart Actions Handlers (These now receive itemId from the event) ---
const handleIncreaseQuantity = (itemId: string) => {
  // Logic remains the same, calls the store function
  const item = items.value.find(i => i.id === itemId);
  if (item) {
    updateItemQuantity(itemId, item.quantity + 1);
  }
};

const handleDecreaseQuantity = (itemId: string) => {
  // Logic remains the same, calls the store function
  const item = items.value.find(i => i.id === itemId);
  // The child component already prevents emitting if quantity is 1,
  // but double-checking here doesn't hurt.
  if (item && item.quantity > 1) {
    updateItemQuantity(itemId, item.quantity - 1);
  }
};

const handleRemoveItem = (itemId: string) => {
  // Logic remains the same, calls the store function
  // Optional: Add confirmation dialog here if desired
  console.log(`Handling remove item event for: ${itemId}`);
  removeItemFromCart(itemId);
};

// --- Formatting (Still needed for Subtotal) ---
const formatCurrency = (value: number, currencyCode: 'DZD' | 'USD' | 'EUR'): string => {
  const locale = currencyCode === 'DZD' ? 'fr-DZ' : 'en-US';
  try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
      }).format(value);
  } catch (error) {
      console.error(`Error formatting currency ${currencyCode}:`, error);
      return `${value} ${currencyCode}`;
  }
};
</script>

<style lang="less" scoped>
/* --- Styles specific to the PARENT component --- */

/* Drawer Styles */
.cart-drawer {
  --size: clamp(360px, 90vw, 480px);

}
.cart-drawer::part(base) {
  z-index: 11000; // Ensure high z-index
}
.cart-drawer::part(overlay) {
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.4);
}
.cart-drawer::part(body) {
    padding: 0; /* Remove default padding from body */
    overflow-y: auto; /* Allow body (items container) to scroll */
    // Base background can be set here or rely on theme
     background-color: var(--sl-color-neutral-100);
}

/* Empty Cart Message */
.empty-cart-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70vh; // Takes up significant space when empty
  text-align: center;
  padding: 2rem;
  color: var(--sl-color-neutral-500);
  font-size: var(--sl-font-size-medium);
}

/* Cart Items Container */
.cart-items-container {
  display: flex;
  flex-direction: column;
  // Add border between items using adjacent sibling selector
  > * + * { // Targets any direct child element following another direct child
    border-top: 1px solid var(--sl-color-neutral-200);
  }
}

/* --- REMOVE styles that are now specific to CartItemDisplay.vue --- */
/* --- e.g., .cart-item-grid, .item-col-1, .item-image-wrapper, .quantity-controls-visual, etc. --- */
/* --- Keep only styles for elements remaining in THIS template --- */


/* Footer Styling */
.cart-footer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--sl-color-neutral-200);
  background-color: var(--sl-color-neutral-50); // Light background for footer
}
.subtotal {
  font-size: var(--sl-font-size-medium);
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  width: 100%;
  color: var(--sl-color-neutral-800);
}
.subtotal span {
    color: var(--sl-color-neutral-700);
}
.subtotal strong {
  font-weight: var(--sl-font-weight-bold);
  font-size: var(--sl-font-size-large);
}
.cart-footer sl-button { // Target the Shoelace button in the footer
    width: 100%;
}
.cart-footer sl-button::part(label) { // Style the button's label part
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

// dark mode
body.dark-mode {

  .cart-drawer::part(header){

  }
  .cart-drawer::part(close-button){
    color:white;
  }

  .cart-drawer::part(body),.cart-drawer::part(footer),.cart-drawer::part(header)  {
    background-color: var(--sl-color-neutral-800);
    color: var(--sl-color-neutral-300);


  }
  .empty-cart-message {
    color: var(--sl-color-neutral-300); // Adjust if needed
  }

  // Dark mode border between items
  .cart-items-container > * + * {
      border-top-color: var(--sl-color-neutral-700); // Darker border
  }



  .cart-footer {
    background-color: transparent; // Use global var
    border-top-color: var(--sl-color-neutral-700);
    color: var(--light); // Use global var for text
    position: relative;
    isolation: isolate; // Needed for pseudo-element stacking
  }

  .subtotal span,.subtotal strong {
      color: var(--sl-color-neutral-300); // Lighter grey label
  }

  .checkout-btn::part(base){ // Style the button itself
      background-color: var(--sl-color-blue-500); // Use global var
      border-color: var(--medium); // Match background

  }


}

</style>