<template>
    <div
      class="cart-item-grid"
      :class="{ 'odd-item': index % 2 !== 0 }"
    >
      <!-- Area 1: Image & Controls Column -->
      <div class="item-col-1">
        <!-- Image -->
        <div class="item-image-wrapper">
          <img :src="getImageUrl(item.image)" :alt="item.name + ' image'" class="item-image" />
        </div>
        <!-- Controls -->
        <div class="item-controls-wrapper">
          <div class="quantity-controls-visual">
            <button
              type="button"
              class="quantity-btn decrease-btn"
              :disabled="item.quantity <= 1"
              @click="emitDecrease"
              aria-label="Decrease Quantity"
            >-</button>
            <span class="item-quantity-display">{{ item.quantity }}</span>
            <button
              type="button"
              class="quantity-btn increase-btn"
              @click="emitIncrease"
              aria-label="Increase Quantity"
            >+</button>
          </div>
        </div>
      </div>
  
      <!-- Area 3: Details (Top Right) -->
      <div class="item-details-wrapper">
        <!-- Product Name + Quantity Indicator -->
        <div class="detail-row product-title-row">
          <h3 class="product-name">{{ item.name }} <span class="product-quantity-indicator">X{{ item.quantity }}</span></h3>
        </div>
  
        <!-- Variants -->

        <div v-if="item.size" class="detail-row variant-row">
          <span class="label">SIZE :</span>
          <span class="value size-value">
            {{ item.size}}
          </span>

        </div>
        <div v-if="item.color" class="detail-row variant-row">
          <span class="label">COLOR :</span>
          <span  class="value color-value">
            <span class="color-swatch" :style="{ backgroundColor: item.color.value }"></span>
            {{ item.color.name }}
          </span>
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
      <div class="item-total-wrapper">
        <span class="label">TOTAL :</span>
        <div class="value total-value">
          <span class="current-total">{{ formatCurrency(item.price * item.quantity, currency) }}</span>
          <span v-if="item.previousPrice && item.previousPrice > item.price" class="savings-amount">
            ({{ formatCurrency((item.previousPrice - item.price) * item.quantity, currency) }} SAVED)
          </span>
        </div>
      </div>
  
      <!-- Area 5: Remove Button using SVG -->
      <button
        type="button"
        class="remove-item-btn"
        @click="emitRemove"
        aria-label="Remove Item"
      >
        <!-- Replaced Minus with a Trash/Close icon for better UX -->
        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/></svg>
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits,onMounted, type PropType } from 'vue';
import {formatCurrency} from "@js/utils"
  // Assuming CartStore provides these types and functions
  import { type CartItem, getImageUrl } from '@/js/CartStore'; // Adjust path if needed
  import {currency} from "@data/client.json"


  interface Props {
    item: CartItem; // Make item prop required and typed
    index: number // For alternating background style
  }
  
  // Define props with defaults and types
  const props = withDefaults(defineProps<Props>(), {
    // `item` is required implicitly by not having a default
    // `index` is required
  });
  
  onMounted(()=>{
    console.log("i recieved this item nigaa" , props.item);
    
    
  })
  // Define the events this component can emit
  const emit = defineEmits<{
    (e: 'increase-quantity', itemId: string): void;
    (e: 'decrease-quantity', itemId: string): void;
    (e: 'remove-item', itemId: string): void;
  }>();
  
  // --- Emitter Functions ---
  const emitIncrease = () => {
    emit('increase-quantity', props.item.id);
  };
  
  const emitDecrease = () => {
    // Basic check, though button is disabled, doesn't hurt
    if (props.item.quantity > 1) {
      emit('decrease-quantity', props.item.id);
    }
  };
  
  const emitRemove = () => {
    emit('remove-item', props.item.id);
  };
  

  
  </script>
  
  <style lang="less" scoped>
  /* --- Item Grid Layout & Separation --- */
  .cart-item-grid {
    display: grid;
    grid-template-columns: minmax(75px, auto) 1fr;
    grid-template-rows: auto auto;
    grid-template-areas:
      "image    details"
      "image    item-total";
    gap: 0.5rem 1rem;
    position: relative;
    padding: 1.5rem;
    background-color: var(--sl-color-neutral-0);
  
    &.odd-item {
        background-color: var(--sl-color-neutral-50);
    }

  }
  
  /* --- Grid Area Styling --- */
  
  /* Col 1: Image & Controls */
  .item-col-1 {
    grid-area: image;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    align-items: start;
  }
  
  /* 1. Image */
  .item-image-wrapper {
      width: 100%;
      max-width: 75px;
      aspect-ratio: 1 / 1;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: white;
  }
  .item-image {
    display: block;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  /* 2. Controls */
  .item-controls-wrapper {
      width: 100%;
      max-width: 85px;
  }
  .quantity-controls-visual {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: none;

    overflow: hidden;
    height: 30px;
    width: 100%;
    color: var(--sl-color-neutral-700);
  }
  .quantity-btn {
    background-color: transparent;
    border: none;
    font-size: 1.4rem;
    line-height: 1;
    font-weight: normal;
    padding: 0 0.5rem;
    cursor: pointer;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;
    flex-basis: 25px;
    color: var(--sl-color-neutral-800);
  }
  .quantity-btn:hover:not(:disabled) {
      color: var(--sl-color-neutral-900);
  }
  .quantity-btn:disabled {
      color: var(--sl-color-neutral-600);
      cursor: not-allowed;
  }
  .item-quantity-display {
    font-size: 0.9rem;
    font-weight: bold;
    color: var(--sl-color-neutral-900);
    padding: 0 0.3rem;
    min-width: 1.5ch;
    text-align: center;
  }
  
  
  /* 3. Details */
  .item-details-wrapper {
      grid-area: details;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      padding-top: 0.1rem;
  }
  .detail-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
  }
  .product-title-row {
      margin-bottom: 0.2rem;
      align-items: center;
  }
  .variant-row, .price-row {
       line-height: 1.3;
  }
  
  /* Styling within Details */
  .label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--sl-color-neutral-700);
      text-transform: uppercase;
      white-space: nowrap;
      line-height: inherit;
  }
  .value {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--sl-color-neutral-800);
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.4rem;
      line-height: inherit;
  }
  .product-name {
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--sl-color-neutral-800);
      margin: 0;
      line-height: 1.2;
  }
  .product-quantity-indicator {
      font-size: 0.85rem;
      font-weight: bold;
      padding: 0.1em 0.4em;
      display: inline-block;
      background-color: #eee;
  }
  .size-value {
      text-transform: uppercase;
      color: var(--sl-color-neutral-800);
      font-weight: 800;
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
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--sl-color-neutral-800);
  }
  .previous-price {
      color: var(--sl-color-neutral-700);
      text-decoration: line-through;
      font-weight: bold; // Kept bold for emphasis
      font-size: 0.85em; // Relative sizing
  }
  
  /* 4. Item Total */
  .item-total-wrapper {
      grid-area: item-total;
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      align-self: end;
      padding-bottom: 0.1rem;
  }
  .total-value {
       align-items: baseline;
       gap: 0.5rem;

  }
  .current-total {
      font-size: 1.1rem;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 4px;
      color: white; 
      background-color: rgb(43, 43, 43); // Use CSS var defined globally
  }
  .savings-amount {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--sl-color-success-600);
  }
  
  /* 5. Remove Button */
  .remove-item-btn {
      position: absolute;
      top: 0.8rem;
      /* Changed from left to right for conventional placement */
      right: 0.75rem;
      z-index: 2;
      background: none;
      border: none;
      padding: 0.2rem;
      cursor: pointer;
      color: var(--sl-color-neutral-500);
      transition: color 0.2s ease, transform 0.2s ease;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.8;
  
      svg {
          width: 18px; // Slightly smaller icon
          height: 18px;
      }
  
      &:hover {
        color: var(--sl-color-danger-600); // Red on hover
        transform: scale(1.1); // Slight scale effect
        opacity: 1;
      }
  }
  

  body.dark-mode { // Example if parent adds .dark-mode class directly to this component host
      .cart-item-grid {
          background-color: transparent;
      }
      .quantity-controls-visual {
        color:#eee;
      }
       .quantity-btn {
        color:#eee;

           &:hover:not(:disabled) {
               color: var(--sl-color-neutral-300);
          }
           &:disabled {
               color: var(--sl-color-neutral-400); // Keep disabled style
           }
       }
      .item-quantity-display {
        color: var(--sl-color-neutral-200);
      }
  
      .label { color: var(--sl-color-neutral-400); }
      .value { color: var(--sl-color-neutral-200); }
      .product-name,.size-value,.current-price{
         color: var(--sl-color-neutral-300); 
        }
       .previous-price {
         color: var(--sl-color-neutral-400);
        }
       .current-total {
          background-color: var(--medium); // Use global CSS var
          color: var(--sl-color-neutral-300);
       }

      .product-quantity-indicator {
          background-color: var(--sl-color-neutral-800);
      }


       .remove-item-btn {
          color: var(--sl-color-neutral-400);
           &:hover { color: var(--sl-color-danger-400); }
       }
       .item-image-wrapper {
          border-color: var(--sl-color-neutral-700);
          background-color: var(--sl-color-neutral-800); // Darker bg for image container
       }
       .color-swatch { border-color: var(--sl-color-neutral-600); }
  }
  
  
  </style>