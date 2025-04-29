<template>
    <div class="add-to-cart-footer">
        <div class="action">
            <!-- Disable button based on state, change cursor -->
            <button
                class="add-button"
                :class="{
                    'is-loading': buttonState === 'loading',
                    'is-success': buttonState === 'success'
                }"
                @click="handleAddToCart"
                :disabled="buttonState !== 'idle'"
                aria-live="polite"
                :aria-label="buttonAriaLabel"
            >
                <!-- Loading SVG -->
                <svg v-if="buttonState === 'loading'" class="button-icon" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity="0.5"/><path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"><animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"/></path></svg>

                <!-- Checkmark SVG -->
                <svg v-else-if="buttonState === 'success'" class="button-icon" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24"><path fill="currentColor" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z"/></svg>

                <!-- Default Cart SVG -->
                <svg v-else class="button-icon" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24"><path fill="currentColor" d="M6.01 16.136L4.141 4H3a1 1 0 0 1 0-2h1.985a1 1 0 0 1 .66.235a1 1 0 0 1 .346.627L6.319 5H14v2H6.627l1.23 8h9.399l1.5-5h2.088l-1.886 6.287A1 1 0 0 1 18 17H7.016a1 1 0 0 1-.675-.248a1 1 0 0 1-.332-.616zM10 20a2 2 0 1 1-4 0a2 2 0 0 1 4 0m9 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0m0-18a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0V6h-1a1 1 0 1 1 0-2h1V3a1 1 0 0 1 1-1"/></svg>

                <!-- Show price only when idle -->
                <span v-if="buttonState === 'idle'">
                    {{ formatCurrency(totalPrice) }}
                </span>
                 <!-- Optional: Text for success state -->
                 <span v-else-if="buttonState === 'success'">Added</span>
            </button>
        </div>

        <div class="quantity-control">
            <button
                class="quantity-btn decrease"
                @click="decreaseQuantity"
                :disabled="quantity <= 1 || buttonState !== 'idle'"
                aria-label="Decrease quantity"
            >
                –
            </button>
            <span class="quantity-display" aria-live="polite">{{ quantity }}</span>
            <button
                class="quantity-btn increase"
                @click="increaseQuantity"
                :disabled="buttonState !== 'idle'"
                aria-label="Increase quantity"
            >
                +
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import { addItemToCart } from '@/js/CartStore';
import { formatCurrency } from "@js/utils";

const props = defineProps({
    product:{ type:Object, required:true },
    chosenSize:{
        type:String,
        required:false 
    },
    color:{
        type:Object,
        required:false 
    },
    chosenVariant:{
        type:[Object,null],
        required:false
    }

})

const quantity = ref(1);
const buttonState = ref('idle'); // 'idle', 'loading', 'success'
const loadingTimerId = ref(null);
const successTimerId = ref(null);

// --- Computed Properties ---
const totalPrice = computed(() => quantity.value * props.product.price);
const hasOffer = computed(() => typeof props.product.offer_price === 'number' && props.product.offer_price > props.product.price);
const totalOfferPrice = computed(() => hasOffer.value ? quantity.value * props.product.offer_price : 0);

const buttonAriaLabel = computed(() => {
    switch (buttonState.value) {
        case 'loading': return 'Adding item to cart';
        case 'success': return 'Item successfully added to cart';
        default: return `Add ${quantity.value} to cart for ${formatCurrency(totalPrice.value)}`;
    }
});

// --- Methods ---
const increaseQuantity = () => {
    // No state check needed here as button is disabled if not 'idle'
    quantity.value++;
};

const decreaseQuantity = () => {
    // No state check needed here as button is disabled if not 'idle'
    if (quantity.value > 1) {
        quantity.value--;
    }
};

const handleAddToCart = () => {
    if (buttonState.value !== 'idle') return; // Prevent action if already loading/success

    buttonState.value = 'loading';

    // Simulate API call / store update delay
    loadingTimerId.value = setTimeout(() => {
        const image = props.chosenVariant ?
         props.chosenVariant.images[0].image : props.product.image

         console.log("im sending this image",{image});
        try {
            const productDataForCart = {
                name: props.product.name,
                price: props.product.price,
                previousPrice: props.product.offer,
                image : image,
                size: props.chosenSize ,
                color: props.color
            };
            addItemToCart(productDataForCart, quantity.value);

            // Transition to success state
            buttonState.value = 'success';
            quantity.value = 1; // Reset quantity AFTER successful add

            // Set timer to revert back to idle after showing success
            successTimerId.value = setTimeout(() => {
                buttonState.value = 'idle';
            }, 2000); // Show success for 2 seconds

        } catch (error) {
            console.error("Failed to add item to cart:", error);
            // Optionally handle error state visually
            buttonState.value = 'idle'; // Revert to idle on error
        } finally {
            clearTimeout(loadingTimerId.value);
            loadingTimerId.value = null;
        }

    }, 1500); // Simulate 1.5 second loading time
};

// --- Watchers ---
watch(quantity, (newQuantity, oldQuantity) => {
    // If quantity is changed AFTER a successful add, revert button state
    if (buttonState.value === 'success' && newQuantity !== oldQuantity) {
        buttonState.value = 'idle';
        // Clear the success timer if it's running, as user interaction overrides it
        if (successTimerId.value) {
            clearTimeout(successTimerId.value);
            successTimerId.value = null;
        }
    }
});

// --- Lifecycle ---
onUnmounted(() => {
    // Clear any running timers when component is destroyed
    if (loadingTimerId.value) clearTimeout(loadingTimerId.value);
    if (successTimerId.value) clearTimeout(successTimerId.value);
});

</script>

<style lang="less" scoped>
// Define reusable variables for minimalist styling
@primary-color: #333;
@secondary-color: #777;
@background-color: transparent;
@border-color: #e0e0e0;
@accent-color: #333;
@accent-text-color: #ffffff;
@disabled-color: #cccccc;
@success-color: #28a745; // Green for success

// --- Base Styles (mostly unchanged) ---
.add-to-cart-footer {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding: 12px 0px;
    gap: 16px;
    position: sticky;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
}

.quantity-control {
    flex: 1 999 auto; // Allow button to take available space

    display: flex;
    align-items: center;
    gap: 8px;

    .quantity-btn {
        background-color: #f0f0f0;
        border: 1px solid @border-color;
        color: @primary-color;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        font-size: 1.2rem;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        line-height: 1;
        transition: background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;

        &:hover:not(:disabled) {
            background-color: darken(#f0f0f0, 5%);
            border-color: darken(@border-color, 10%);
        }

        // General disabled state for quantity buttons
        &:disabled {
            background-color: #f9f9f9;
            color: @disabled-color;
            border-color: #f0f0f0;
            cursor: not-allowed;
            opacity: 0.7;
        }
    }

    .quantity-display {
        font-weight: 500;
        font-size: 1rem;
        min-width: 24px;
        text-align: center;
        padding: 0 4px;
        color: @primary-color;
    }
}

.action {
    flex: 2 1 auto; // Allow button to take available space

    .add-button {
        width: 100%; 
        max-width: 270px;
        background-color: @accent-color;
        color: @accent-text-color;
        border: none;

        padding: 10px 15px; // Adjust padding slightly
        border-radius: 6px;
        font-weight: bold;
        font-size: 1.2rem;
        cursor: pointer;
        transition: background-color 0.2s ease, opacity 0.2s ease;
        white-space: nowrap;
        gap: 8px; // Consistent gap
        min-height: 40px; // Ensure consistent height

        display: flex;
        justify-content: center;
        align-items: center;
        margin: auto;

        &:hover:not(:disabled) { // Only apply hover when not disabled
            background-color: darken(@accent-color, 10%);
        }

        // --- State-specific styles ---
        &.is-loading, &.is-success {
             // Optional: subtle background change for loading/success
             // background-color: lighten(@accent-color, 5%);
        }

        &.is-success {
            background-color: @success-color; // Green background for success
             &:hover { // Prevent hover effect on success state
                 background-color: @success-color;
             }
        }

        // General disabled state for the main button
        &:disabled {
            cursor: not-allowed;
            opacity: 0.7;
             // Keep background color during loading/success unless overridden
             &:hover {
                 // Prevent hover background change when disabled
                 background-color: @accent-color; // Or current state color
             }
             &.is-success {
                  background-color: @success-color; // Keep success color when disabled
                  opacity: 0.8; // Slightly less faded for success
             }
        }

        .button-icon {
            // Ensure icons are consistently sized and aligned if needed
            flex-shrink: 0; // Prevent icon from shrinking
        }
    }
}

// --- Responsiveness (Minor Adjustments) ---
@media (max-width: 400px) {
    .add-to-cart-footer {
        padding: 8px 0; // Tighter padding
        gap: 10px;
    }

    .action .add-button {
        padding: 8px 10px;
        font-size: 0.9rem;
        gap: 6px;
        min-height: 36px;
        max-width: 170px;
    }
    .quantity-control .quantity-btn {
        width: 28px;
        height: 28px;
        font-size: 1rem;
    }
     .quantity-control .quantity-display {
         font-size: 0.9rem;
     }
}

// --- Dark Mode ---
body.dark-mode {
    @dark-primary-color: #e0e0e0;
    @dark-secondary-color: #b1b0b0;
    @dark-background-color: #1e1e1e; // Footer bg in dark mode
    @dark-container-bg: #2a2a2a; // Slightly lighter for elements
    @dark-border-color: #444; // Darker border
    @dark-accent-color: #0a84ff;
    @dark-accent-text-color: #ffffff;
    @dark-disabled-color: #666; // Darker disabled text
    @dark-success-color: #34c759; // iOS-like green for dark mode

    .add-to-cart-footer {
        background-color: transparent;

    }

    .quantity-control {
        .quantity-btn {
            background-color: @dark-container-bg;
            border-color: @dark-border-color;
            color: @dark-primary-color;

            &:hover:not(:disabled) {
                background-color: lighten(@dark-container-bg, 5%);
                border-color: lighten(@dark-border-color, 10%);
            }

             &:disabled {
                background-color: lighten(@dark-background-color, 3%); // Slightly lighter than footer bg
                color: @dark-disabled-color;
                border-color: lighten(@dark-background-color, 5%);
                opacity: 0.6;
            }
        }
        .quantity-display {
            color: @dark-primary-color;
        }
    }

    .action .add-button {
        background-color: @dark-accent-color;
        color: @dark-accent-text-color;

        &:hover:not(:disabled) {
            background-color: lighten(@dark-accent-color, 10%);
        }

         &.is-success {
            background-color: @dark-success-color;
             &:hover {
                 background-color: @dark-success-color;
             }
        }

        &:disabled {
             opacity: 0.7;
             &:hover {
                 background-color: @dark-accent-color; // Keep original color on hover when disabled
             }
             &.is-success {
                 background-color: @dark-success-color; // Keep success color
                 opacity: 0.8;
             }
        }
    }
}
</style>