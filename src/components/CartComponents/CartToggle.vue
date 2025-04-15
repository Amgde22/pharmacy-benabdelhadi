<template>
    <button
      type="button"
      class="cart-toggle-button"
      @click="toggleCart"
      aria-label="Toggle Shopping Cart"
    >
      <!-- Shopping Cart Icon SVG -->
      <span class="cart-icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" class="cart-icon-svg">
          <!-- Ensure fill="currentColor" is present -->
          <path fill="currentColor" d="M2.787 2.28a.75.75 0 0 1 .932.508l.55 1.862h14.655c1.84 0 3.245 1.717 2.715 3.51l-1.655 5.6c-.352 1.194-1.471 1.99-2.715 1.99H8.113c-1.244 0-2.362-.796-2.715-1.99L2.281 3.213a.75.75 0 0 1 .506-.932M6.25 19.5a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0m8 0a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0"/>
        </svg>
      </span>

      <!-- Item Count Badge -->
      <span v-if="totalItems > 0" class="item-count-badge">
        {{ totalItems > 99 ? '99+' : totalItems }}
      </span>
    </button>
  </template>

  <script setup lang="ts">
    // --- Keep the existing script setup ---
    import { useStore } from '@nanostores/vue';
    import { $totalItems } from '@/js/CartStore'; // Adjust path

    const totalItems = useStore($totalItems);

    const toggleCart = () => {
      document.body.classList.toggle('cart');
    };
  </script>

  <style lang="less" scoped>
  // Base styles for the toggle button (Light Mode)
  .cart-toggle-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0.5rem;
    margin: 0;
    cursor: pointer;
    // Set initial color explicitly, this color will be inherited by the SVG path
    color: var(--sl-color-neutral-700, #333); // Default dark-ish grey, with fallback
    border-radius: 50%;
    transition: background-color 0.2s ease, color 0.2s ease;

    // Light Mode Hover/Focus
    &:hover,
    &:focus-visible {
      color: var(--sl-color-primary-600, dodgerblue); // Fallback color
      background-color: var(--sl-color-primary-50, #e6f7ff); // Fallback color
      outline: none;
    }
    &:focus-visible {
        box-shadow: 0 0 0 2px var(--sl-color-primary-300, lightblue); // Fallback color
    }

    // Icon wrapper and SVG styles
    .cart-icon-wrapper {
      display: inline-block;
      line-height: 0;
    }
    .cart-icon-svg {
      width: 24px;
      height: 24px;
      display: block;
      // The path inside inherits the button's 'color' property via fill="currentColor"
    }

    // Badge styles (Light Mode)
    .item-count-badge {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(30%, -30%);
      background-color: var(--sl-color-primary-600, dodgerblue); // Fallback color
      color: white;
      border-radius: 50%;
      min-width: 18px;
      height: 18px;
      font-size: 11px;
      font-weight: bold;
      line-height: 18px;
      text-align: center;
      padding: 0 4px;
      box-sizing: border-box;
      box-shadow: 0 0 0 2px white;
      pointer-events: none;
    }
  }

  // Dark Mode Overrides - Target body.dark-mode globally
  // then select the button within it
    body.dark-mode {
    .cart-toggle-button {
      // *** FIX: Set the button's color directly for dark mode ***
      // This color will be inherited by the SVG's path via fill="currentColor"
      color: var(--sl-color-neutral-300, #ccc); // Light grey, with fallback

      // Override hover/focus for dark mode
      &:hover,
      &:focus-visible {
        color: var(--sl-color-primary-300, lightskyblue); // Fallback color
        background-color: rgba(255, 255, 255, 0.1); // Use rgba for transparency control
      }
       &:focus-visible {
          box-shadow: 0 0 0 2px var(--sl-color-primary-500, dodgerblue); // Adjusted focus ring
      }

      // Override badge border for dark mode
      .item-count-badge {
        // Using a dark background color from Shoelace variables
        box-shadow: 0 0 0 2px var(--sl-color-neutral-800, #333); // Fallback color
      }
    }
  }
  </style>