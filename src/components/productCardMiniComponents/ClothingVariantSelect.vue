<template>
    <div class="variant-select-container">
        <p class="variant-label">Color:
            <span class="selected-color-name">
                {{ selectedVariantColorName }}
            </span>
            </p>
        <div class="colors-container">
            <button
                v-for="(variant, index) in variants"
                :key="variant.color.value"
                class="color-select"
                :class="{ active: variant.color.value === selectedVariantColor }"
                :style="{
                    backgroundColor: variant.color.value,
                    '--color-name': `'${variant.color.name}'` // Set CSS variable for tooltip content
                }"
                @click="selectColor(variant)"
                :aria-label="variant.color.name + ' color option'"
            ></button>
        </div>

        <p class="variant-label">Size: <span class="selected-size-name">
                {{ selectedSize }}
            </span></p>
        <div class="sizes-container">
            <!-- Loop over the fixed list of all possible sizes -->
            <button
                v-for="size in allPossibleSizes"
                :key="size"
                class="size-select"
                :class="{ active: size === selectedSize }"
                :disabled="!availableSizes.includes(size)" 
                @click="selectSize(size)"
                :aria-label="size + ' size option'"
            >
                {{ size }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch,onMounted } from 'vue';

const props = defineProps({
    product:{type:Object,required:true}
})

const { variants } = props.product;

// Define the fixed, ordered list of all possible sizes
const allPossibleSizes = ["XS", "S", "M", "L", "XL", "XXL"];

// State to track the currently selected color variant object and size string
const selectedVariantColor = ref(null);
const selectedVariantColorName = ref(null);
const selectedSize = ref(null);
const availableSizes = ref([]); // Sizes available for the currently selected color


onMounted(()=>{
    if (variants && variants.length > 0) {
    selectedVariantColor.value = variants[0].color.value; // Default to the first color variant

    if (variants[0].available_sizes && variants[0].available_sizes.length > 0) {
         // Find the first available size that is also in our ordered list (for safety, though usually they match)
         const firstAvailableOrderedSize = allPossibleSizes.find(size => variants[0].available_sizes.includes(size));
         selectedSize.value = firstAvailableOrderedSize || variants[0].available_sizes[0] || null;
        availableSizes.value = variants[0].available_sizes; // Set initial available sizes
    } else {
        selectedSize.value = null;
        availableSizes.value = [];
    }
}
})


// Define the emit event
const emit = defineEmits(['update:selectedVariant']);

// Function to handle color selection
const selectColor = (variant) => {
    selectedVariantColor.value = variant.color.value;
    selectedVariantColorName.value = variant.color.name
    // Update the available sizes based on the newly selected color variant
    availableSizes.value = variant.available_sizes || [];

    // Reset the selected size: try to keep the current size if it's available in the new color,
    // otherwise, select the first available size for this new color (in the preferred order), or null.
    if (selectedSize.value && availableSizes.value.includes(selectedSize.value)) {
        // Keep the current selected size if it's available in the new color
    } else {
         const firstAvailableOrderedSize = allPossibleSizes.find(size => availableSizes.value.includes(size));
         selectedSize.value = firstAvailableOrderedSize || availableSizes.value[0] || null;
    }
};

// Function to handle size selection
const selectSize = (size) => {
     // Only allow selection if the size is available for the current color
     if (availableSizes.value.includes(size)) {
        selectedSize.value = size;
     }
     // If the size is disabled, clicking it does nothing due to the 'disabled' attribute.
};


watch([selectedVariantColor, selectedSize], ([newColorVariant, newSize]) => {
    if (newColorVariant && newSize) {

        const selected_variant = variants.find(variant =>variant.color.value === newColorVariant)

        emit('update:selectedVariant', {
            ...selected_variant, // Includes color object, images array, available_sizes array
            chosenSize: newSize, // The single selected size string
        });
    } 
    // else {
    //     // If selection is incomplete (e.g., no sizes for the selected color or no size selected), emit null or an incomplete state
    //      // Find the currently selected variant by reference comparison or a unique identifier if available
    //      const currentVariantData = variants.find(v => v === newColorVariant);

    //      if (currentVariantData) {
    //           emit('update:selectedVariant', {
    //               ...currentVariantData,
    //               chosenSize: newSize, // This might be null if no size is selected
    //           });
    //      } else {
    //          emit('update:selectedVariant', null); // Should ideally not happen if default initialization works
    //      }
    // }
}, { immediate: true }); // The `immediate: true` option means this watcher runs once immediately after component creation to emit the default selected variant.

</script>

<style lang="less" scoped>
.variant-select-container {
    padding-top: 16px;
    font-family: sans-serif; 
    color: #333;
    margin-bottom: 20px;
border-bottom: 2px solid var(--sl-color-neutral-400);
}

.variant-label {
    margin-bottom: 8px;
    font-weight: bold;
    font-size: 1rem;
    color: var(--sl-color-neutral-700);
    text-transform: uppercase; // Make labels uppercase for minimalist feel
    letter-spacing: 0.05em;
}
.selected-color-name,.selected-size-name{
    padding: 2px 4px;
    border-bottom: 1px solid currentColor;
    &:empty{
        display: none;
    }
}

.colors-container, .sizes-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
    align-items: center; // Vertically align items
}

.color-select {
    --size: 30px;
    position: relative; 
    width: var(--size);
    height: var(--size);
    border: 2px solid transparent;
    border-radius: 50%;
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    // Custom Tooltip using ::before
    &::before {
        content: var(--color-name); // Get content from CSS variable
        position: absolute;
        bottom: 100%; left: 100%;
        transform: translateX(6px); // Center and add slight space
        white-space: nowrap; // Prevent text wrapping
        background-color: #333;
        color: #fff;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        pointer-events: none; // Ensure clicks pass through the tooltip
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease;
        z-index: 10; 
    }

    &:hover::before,
    &:focus::before {
        bottom: 50%; left: 100%;
        opacity: 1; 
        visibility: visible; 
        transform: translateY(50%) translateX(6px); 
    }


    &:hover, &:focus {
         border-color: #999;
    }
    &.active {
        border-color: #333;
        box-shadow: 0 0 0 2px #f9f9f9, 0 0 0 4px #333; // Lighter inner ring, dark outer ring

    }
}
.size-select {
    padding: 8px 12px;
    border: 1px solid #ccc;
    background-color: #fff;
    cursor: pointer;
    border-radius: 4px;
    font-size: 14px;
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, opacity 0.2s ease;
    min-width: 40px;
    text-align: center;
    outline: none;

    &:hover:not(:disabled,.active) { // Hover/focus styles only for enabled buttons
        background-color: #f0f0f0;
        border-color: #aaa;
    }

    &.active {
        background-color: #333;
        color: #fff;
        border-color: #333;
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5; // Dim disabled buttons
        background-color: #eee; // Grey out background
        color: #888; // Grey out text
        border-color: #eee;
    }
}
/* ==========================================================================
   Dark Mode Styles (body.dark-mode)
   ========================================================================== */

   @media only screen and (min-width: 0rem) {
  body.dark-mode {
    .variant-label {
        color: var(--sl-color-neutral-300);
    }

    .size-select {
    border: 1px solid var(--sl-color-neutral-600);
    background-color:var(--sl-color-neutral-700) ;
    color: var(--sl-color-neutral-200);


    &:hover:not(:disabled,.active) { // Hover/focus styles only for enabled buttons
        background-color: var(--sl-color-neutral-700);
        border-color: var(--sl-color-neutral-400);
    }

    &.active {
        background-color: #2a2a2a;
        color: var(--sl-color-neutral-100);

    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.9; 
        background-color:var(--sl-color-neutral-700) ;
        color: #888; 
    }
        }
    }
  
  
  }
</style>