<template>
  <sl-drawer 
    ref="drawer"
    :label="`Your Cart (${totalItems})`"
    placement="end"
    class="cart-drawer"
    :class="{
      ' sl-theme-dark':darkThemeActive
    }"

    :open="isOpen"
    @sl-hide="handleCloseIntent"
  >
    <div v-if="items.length === 0" class="empty-cart-message">
       <sl-icon name="cart-x" style="font-size: 3rem; margin-bottom: 1rem;"></sl-icon>
      Your cart is empty. Add some items to get started!
    </div>

    <div ref="cartItemsContainer" v-else class="cart-items-container">
      <div
         v-for="(item, index) in items"
         :key="item.id"
         class="cart-item-grid"
         :class="{ 'odd-item': index % 2 !== 0 }"
      >

         <!-- Area 1: Image & Controls Column -->
         <!-- Renamed class for clarity -->
         <div class="item-col-1" style="grid-area: image;">
           <!-- Image -->
           <div class="item-image-wrapper" >
             <img :src="getImageUrl(item.image)" :alt="item.name + ' image'" class="item-image" />
           </div>
           <!-- Controls -->
           <div class="item-controls-wrapper">
              <!-- Visual controls matching image -->
              <div class="quantity-controls-visual" >
                <button
                   type="button"
                   class="quantity-btn decrease-btn"
                   :disabled="item.quantity <= 1"
                   @click="handleDecreaseQuantity(item.id)"
                   aria-label="Decrease Quantity"
                >-</button>
                <!-- Display quantity next to buttons now -->
                <span class="item-quantity-display">{{ item.quantity }}</span>
                <button
                   type="button"
                   class="quantity-btn increase-btn"
                   @click="handleIncreaseQuantity(item.id)"
                   aria-label="Increase Quantity"
                >+</button>
              </div>
           </div>
         </div>


         <!-- Area 3: Details (Top Right) -->
         <div class="item-details-wrapper" style="grid-area: details;">
           <!-- Product Name + Quantity Indicator -->
           <div class="detail-row product-title-row">
              <!-- Display quantity indicator here still? Or rely on controls? -->
              <!-- Let's keep it for clarity, like "Name x3" -->
              <h3 class="product-name">{{ item.name }} <span class="product-quantity-indicator">X{{ item.quantity }}</span></h3>
           </div>

           <!-- Variants -->
            <div class="detail-row variant-row">
               <span class="label">SIZES :</span>
                <span v-if="item.sizes && item.sizes.length > 0" class="value size-value">
                    {{ item.sizes.join(' - ') }}
                </span>
                <span v-else class="value">-</span>
            </div>
            <div class="detail-row variant-row">
                 <span class="label">COLOR :</span>
                 <span v-if="item.color" class="value color-value">
                     <span class="color-swatch" :style="{ backgroundColor: item.color.value }"></span>
                     <!-- {{ item.color.name }} -->
                 </span>
                 <span v-else class="value">-</span>
            </div>

            <!-- Pricing -->
            <div class="detail-row price-row">
                 <span class="label">PRIX :</span>
                 <div class="value price-value">
                         <span class="current-price">{{ formatCurrency(item.price, currency) }}</span>
                         <span v-if="item.previousPrice && item.previousPrice > item.price" class="previous-price">
                            {{ formatCurrency(item.previousPrice, currency) }}
                         </span>
                 </div>
            </div>

         </div>

         <!-- Area 4: Item Total (Bottom Right) -->
         <div class="item-total-wrapper" style="grid-area: item-total;">
             <span class="label">TOTAL :</span>
             <div class="value total-value">
                 <span class="current-total">{{ formatCurrency(item.price * item.quantity, currency) }}</span>
                 <!-- Show savings here, associated with the total -->
                 <span v-if="item.previousPrice && item.previousPrice > item.price" class="savings-amount">
                   ({{ formatCurrency((item.previousPrice - item.price)* item.quantity, currency) }} SAVED)
                 </span>
             </div>
         </div>

          <!-- Area 5: Remove Button using SVG -->
          <!-- Positioned absolutely relative to cart-item-grid -->
          <button
            type="button"
            class="remove-item-btn"
            @click="handleRemoveItem(item.id)"
            aria-label="Remove Item"

          >
            <!-- Embed the provided SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 12.998H5v-2h14z"/>
              <!-- WARNING: This is a MINUS icon, not ideal for REMOVE -->
            </svg>
          </button>

      </div>
    </div>

    <!-- Footer -->
    <div slot="footer" class="cart-footer">
        <!-- (Keep existing footer content) -->
        <div v-if="items.length > 0" class="subtotal">
         <span>Subtotal:</span>
         <strong>{{ formatCurrency(subtotal, currency) }}</strong>
       </div>
       <sl-button 
       href="/checkout"
       class="checkout-btn" variant="primary" size="large" :disabled="items.length === 0">
        Proceed to Checkout
        <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24"><path fill="currentColor" d="m12 10l-1.4-1.4L12.175 7H8V5h4.175l-1.6-1.6L12 2l4 4zM7 22q-.825 0-1.412-.587T5 20t.588-1.412T7 18t1.413.588T9 20t-.587 1.413T7 22m10 0q-.825 0-1.412-.587T15 20t.588-1.412T17 18t1.413.588T19 20t-.587 1.413T17 22M1 4V2h3.275l4.25 9h7l3.9-7H21.7l-4.975 9H8.1L7 15h12v2H3.625L6.6 11.6L3 4z"/></svg>
       </sl-button>
    </div>
  </sl-drawer>
</template>

<script setup lang="ts">
// --- Imports, Props, State, Logic ---
// (Keep all existing <script setup> content: imports, props, state,
// observers, handlers, formatCurrency, etc.)
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useStore } from '@nanostores/vue';
import { lock, unlock } from 'tua-body-scroll-lock'

// --- Shoelace Imports ---
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'; // Still needed for drawer icon
import '@shoelace-style/shoelace/dist/components/icon/icon.js'; // Still needed for drawer/button icons
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js'; // Keep if used elsewhere

// --- Store Imports ---
import {
  $cartItems,
  $subtotal,
  $totalItems,
  updateItemQuantity,
  removeItemFromCart,
  getImageUrl,
  type CartItem
} from '@/js/CartStore'; // Adjust path if needed

// --- Props ---
interface Props {
  currency?: 'DZD' | 'USD' | 'EUR';
}

const props = withDefaults(defineProps<Props>(), {
  currency: 'DZD',
});


// --- State ---
const items = useStore($cartItems);
const subtotal = useStore($subtotal);
const totalItems = useStore($totalItems);
const isOpen = ref(document.body.classList.contains('cart'));
const darkThemeActive = ref(false)
const drawer = ref<HTMLElement | null>(null);

// --- Body Class Sync & Drawer Interaction ---
let observer: MutationObserver | null = null;
// cart items parent for scroll lock
const cartItemsContainer = ref(null)
onMounted(() => {
  const checkBodyClass = () => {
    const bodyHasCartClass = document.body.classList.contains('cart');
    if (bodyHasCartClass !== isOpen.value) {
       isOpen.value = bodyHasCartClass;

       if(bodyHasCartClass) {
          lock(cartItemsContainer.value)
       }
       else{
          unlock(cartItemsContainer.value)
       }
    }

    const bodyHasDarkClass = document.body.classList.contains('dark-mode');
    if (bodyHasDarkClass){
      darkThemeActive.value=true
    }
    else{
      darkThemeActive.value=false

    }

  };

  checkBodyClass();

  observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        checkBodyClass();
        break;
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
});

const handleCloseIntent = () => {
    setTimeout(() => {
        if ( document.body.classList.contains('cart')) {
            document.body.classList.remove('cart');
        }
    }, 50);
};

// --- Cart Actions ---
const handleIncreaseQuantity = (itemId: string) => {
  const item = items.value.find(i => i.id === itemId);
  if (item) {
    updateItemQuantity(itemId, item.quantity + 1);
  }
};

const handleDecreaseQuantity = (itemId: string) => {
  const item = items.value.find(i => i.id === itemId);
  if (item && item.quantity > 1) {
    updateItemQuantity(itemId, item.quantity - 1);
  }
};

const handleRemoveItem = (itemId: string) => {
  // Optional: Add confirmation dialog here
  console.log(`Removing item: ${itemId}`);
  removeItemFromCart(itemId);
};

// --- Formatting ---
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
/* --- General Drawer Styles --- */
.cart-drawer {
  --size: clamp(360px, 90vw, 480px);
}
.cart-drawer::part(base) {
  z-index: 11000;

}
.cart-drawer::part(overlay) {
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.4);
}
.cart-drawer::part(body) {
    padding: 0; /* Remove default padding */
    overflow-y: auto;
    background-color: var(--sl-color-neutral-100); // Base background for the list area
}

/* --- Empty Cart Message --- */
.empty-cart-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70vh;
  text-align: center;
  padding: 2rem;
  color: var(--sl-color-neutral-500);
  font-size: var(--sl-font-size-medium);

}

/* --- Cart Items Container --- */
.cart-items-container {
  display: flex;
  flex-direction: column;
  // Removed padding and gap, handled by item styling now
}

/* --- Item Grid Layout & Separation --- */
.cart-item-grid {
  display: grid;
  // Adjusted columns for slightly smaller image area
  grid-template-columns: minmax(75px, auto) 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    "image    details"    // Row 1: Image Col, Details Col
    "image    item-total" // Row 2: Image Col (spans controls), Total Col
;    // Area for absolute positioning remove button
  gap: 0.5rem 1rem; // Row gap, Column gap
  position: relative;
  padding: 1.5rem; // Padding inside each item 'card'

  // Default background (even items)
  background-color: var(--sl-color-neutral-0); // White

  // Alternating background (odd items)
  &.odd-item {
      background-color: var(--sl-color-neutral-50); // Very light grey
  }

  // Thin divider line between items (optional, can use background difference only)
  border-bottom: 1px solid var(--sl-color-neutral-200);
  &:last-child {
      border-bottom: none; // No border for the last item
  }
}


/* --- Grid Area Styling --- */

/* Col 1: Image & Controls */
.item-col-1 {
  grid-area: image; // This div now spans both rows in the first column implicitly by grid-area
  display: flex;
  flex-direction: column;
  gap: 0.8rem; // Space between image and controls
  align-items: start; // Align items to the start of the column
}

/* 1. Image */
.item-image-wrapper {
    width: 100%;
    max-width: 75px; // Smaller image
    aspect-ratio: 1 / 1;
    border: 1px solid var(--sl-color-neutral-200);
    border-radius: var(--sl-border-radius-medium);
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white; // Ensure bg for transparency
}
.item-image {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* 2. Controls */
.item-controls-wrapper {
    width: 100%; // Take width of the column
    max-width: 85px; // Prevent controls getting too wide if col is auto
}
.quantity-controls-visual {
  display: flex; // Use flex for button/quantity layout
  align-items: center;
  justify-content: space-between; // Push buttons to edges
  border: 1px solid var(--sl-color-neutral-900);
  border-radius: var(--sl-border-radius-pill); // Pill shape
  overflow: hidden;
  height: 30px; // Slightly smaller controls
  width: 100%; // Take wrapper width
  color: var(--sl-color-neutral-700); // Greyish color

}
.quantity-btn {
  background-color: transparent; // Make buttons transparent
  border: none;
  font-size: 1.4rem; // Larger +/- symbols
  line-height: 1;
  font-weight: normal;
  padding: 0 0.5rem;
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  flex-basis: 25px; // Give buttons a base size
  color: var(--sl-color-neutral-800); // Darken on hover

}
.quantity-btn:hover:not(:disabled) {
    color: var(--sl-color-neutral-900); // Darken on hover
}
.quantity-btn:disabled {
    color: var(--sl-color-neutral-600);
    cursor: not-allowed;
}
.item-quantity-display {
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--sl-color-neutral-900); // Black quantity
  padding: 0 0.3rem;
  min-width: 1.5ch;
  text-align: center;
  // No borders needed within the controls now
}


/* 3. Details */
.item-details-wrapper {
    grid-area: details;
    display: flex;
    flex-direction: column;
    gap: 0.6rem; // Slightly more gap
    padding-top: 0.1rem; // Align top better
}
.detail-row {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    flex-wrap: wrap; // Allow values to wrap if needed
}
.product-title-row {
    margin-bottom: 0.2rem; // Reduced space below title
    align-items: center;
}
.variant-row, .price-row {
     line-height: 1.3; // Improve readability of smaller text
}

/* Styling within Details */
.label {
    font-size: 0.8rem; // Smaller label
    font-weight: 600; // Less bold label
    color: var(--sl-color-neutral-700); // Slightly darker faded label
    text-transform: uppercase;
    white-space: nowrap;
    line-height: inherit;

}
.value {
    font-size: 0.9rem; // Slightly smaller value text
    font-weight: 600;
    color: var(--sl-color-neutral-800);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.4rem;
    line-height: inherit;
}

.product-name {
    font-size: 1.05rem; // Slightly smaller name
    font-weight: 600; // Less bold name
    color: var(--sl-color-neutral-800); // Use standard black for name now
    margin: 0;
    line-height: 1.2;
}
.product-quantity-indicator {
    font-size: 0.85rem; // Smaller indicator
    font-weight: bold;
    color: var(--sl-color-primary-600); // Use primary color? Or keep black?
    background-color: var(--sl-color-primary-100); // Subtle background for quantity
    padding: 0.1em 0.4em;
    border-radius: var(--sl-border-radius-small);
    display: inline-block; // Needed for padding/bg
}

.size-value {
    text-transform: uppercase;
    color: var(--sl-color-neutral-800);
    font-weight: 500;
}
.color-swatch {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid var(--sl-color-neutral-300);
    display: inline-block;
}

.price-value {
    align-items: baseline;
}
.current-price {
    font-weight: 600; // Less bold
    font-size: 0.95rem;
    color: var(--sl-color-neutral-800);
}
.previous-price {
  color: var(--sl-color-neutral-700); // Slightly darker faded label

    text-decoration: line-through;
    font-weight: bold;
    font-size: 0.85em;
}

/* 4. Item Total */
.item-total-wrapper {
    grid-area: item-total;
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    align-self: end; // Align to bottom of its grid area
    padding-bottom: 0.1rem; // Align text baseline better
}
.total-value {
     align-items: baseline;
     gap: 0.5rem;
}
.current-total {
    font-size: 1.1rem; // Larger total
    font-weight: 600; // Less bold
    // color: var(--sl-color-primary-600); // Use primary color for total
    // Remove background style from previous version
    padding: 4px 8px;
    border-radius: 4px;
    color: white;
    background-color: var(--primary);
}
.savings-amount {
    font-size: 0.85rem;
    font-weight: 600; // Less bold
    color: var(--sl-color-success-600);
}

/* 5. Remove Button */
.remove-item-btn { 
    position: absolute;
    top: 0.8rem; // Adjust position relative to padding
    left: 0.75rem;
    z-index: 2; // Ensure above content
    background: none;
    border: none;
    padding: 0.2rem;
    cursor: pointer;
    color: var(--sl-color-neutral-500); // Initial color
    transition: color 0.2s ease, background-color 0.2s ease;
    border-radius: 50%; // Make it round
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--sl-color-danger-600); // Red on hover
        background-color: var(--sl-color-danger-300); // Light red background on hover
    opacity: 0.8;
    // Direct SVG styling if needed, but `currentColor` should work
    svg {
        width: 24px; // Control SVG size
        height: 24px;
    }

    &:hover {
      opacity: .95;
    }
}


/* --- Footer Styling --- */
/* (Keep existing footer styles) */
.cart-footer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--sl-color-neutral-200);
  background-color: var(--sl-color-neutral-50);
  
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
.cart-footer sl-button {
    width: 100%;
}
.cart-footer sl-button::part(label) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

// dark mode styles
body.dark-mode{

  .cart-drawer ,
  .cart-drawer::part(panel) ,
  .empty-cart-message,
  .cart-item-grid{
    color:#eee;
    background-color: var(--dark);
  }


  .current-total,.quantity-controls-visual {
    color: #eee;
    background-color: var(--medium);
}
.savings-amount {
    color: var(--sl-color-neutral-700);
}
.cart-footer {
  position: relative;
  background-color: var(--dark);
  isolation: isolate;
}
.cart-footer::after {
  content: "";
  position: absolute;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.05);
  
  z-index: -1;
}
.checkout-btn::part(base){
  color: white;
  background-color: var(--medium);
}

}



</style>
