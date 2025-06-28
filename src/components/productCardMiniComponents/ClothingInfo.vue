<template>
  <div v-if="isClothingProduct" class="clothing-info">
    <!-- Colors -->
    <div class="color-swatches">
      <div 
        v-for="variant in product.variants" 
        :key="variant.color.name"
        class="color-swatch"
        :style="{ backgroundColor: variant.color.value }"
        :title="variant.color.name"
      />
    </div>

    <!-- Sizes -->
    <div class="size-badges">
      <span 
        v-for="size in allAvailableSizes" 
        :key="size"
        class="size-badge"
      >
        {{ size }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { CheckIfClothingProduct } from '@/js/utils'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const isClothingProduct = computed(() => CheckIfClothingProduct(props.product))

const allAvailableSizes = computed(() => {
  if (!props.product.variants) return []
  
  const sizes = new Set()
  props.product.variants.forEach(variant => {
    variant.available_sizes?.forEach(size => sizes.add(size))
  })
  
  return Array.from(sizes).sort()
})
</script>

<style lang="less" scoped>
.clothing-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  
  .color-swatches {
    display: flex;
    gap: 0.25rem;
    
    .color-swatch {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      border: 1px solid #e5e5e5;
      cursor: pointer;
      
      &:hover {
        transform: scale(1.1);
      }
    }
  }
  
  .size-badges {
    display: flex;
    gap: 0.25rem;
    
    .size-badge {
      padding: 0.125rem 0.375rem;
      border: 1px solid #e5e5e5;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      color: #525252;
    }
  }
  

}
@media only screen and (min-width: 0rem) {
  body.dark-mode {

    .clothing-info {

    .size-badge {
      padding: 0.125rem 0.375rem;
      border: 1px solid  #9d9c9c;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      color: #e5e5e5 ;
    }
}
  }}
</style>
