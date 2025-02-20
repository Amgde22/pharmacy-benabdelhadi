<template>
  <div class="product-card">
    <img :src="imageUrl" :alt="name" class="product-image" />
    <h3 class="product-name">{{ name }}</h3>
    <p class="product-description">{{ description }}</p>
    <div class="product-price-and-button">
      <span class="product-price">{{ formattedPrice }}</span>

      <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <defs>
          <mask id="ipSMoreTwo0">
            <g fill="none">
              <path fill="#fff" stroke="#fff" stroke-linejoin="round" stroke-width="4" d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z" />
              <circle cx="14" cy="24" r="3" fill="#000" />
              <circle cx="24" cy="24" r="3" fill="#000" />
              <circle cx="34" cy="24" r="3" fill="#000" />
            </g>
          </mask>
        </defs>
        <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSMoreTwo0)" />
      </svg>

      <Button label="clicked" />


    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';


import Button from "primevue/button"




// Define the props for the component
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: { // Add an imageUrl property
    type: String,
    required: true
  },
  offer: {
    type: Object,
    default: () => ({}) // Optional object, so provide a default
  }
});

// Compute the formatted price
const formattedPrice = computed(() => `$${props.price.toFixed(2)}`);

</script>

<style lang="less">



  @shadow-color: rgba(0, 0, 0, 0.2);
  @border-radius: 0.5rem;
  @golden-color: #ffc107;
  @text-color: #333;

  .product-card {
    font-size: 0.8em;
    box-shadow: 0 0.25rem 0.5rem @shadow-color;
    border-radius: @border-radius;
    padding: 1rem;
    margin-bottom: 1rem;
    background-color: white;
    transition: transform 0.2s ease-in-out;

    max-width: 350px;
    display: flex;
    flex-direction: column;
    height: 100%;

    cursor: pointer;
  }

  .product-image {
    width: 100%;
    height: auto;
    max-height: 200px;
    border-radius: @border-radius;
    margin-bottom: 0.75rem;
    object-fit: cover; // Ensure image fills container without distortion
    aspect-ratio: 16/9; //Maintain the aspect ratio, even if width and height are not set
  }

  .product-name {
    font-size: 1.25em;
    margin-bottom: 0.5rem;
    color: @text-color;
    flex-grow: 1;
  }

  .product-description {
    font-size: 1em;
    color: @text-color;
    line-height: 1.4;
    margin-bottom: 0.75rem;


    overflow: hidden;
    max-height: 3.8em;
  }

  .product-price-and-button {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .product-price {
    font-size: 1.5em;
    font-weight: bolder;

  }

  .icon{
    cursor: pointer;
    color: var(--primary);
    width: 36px;
    height: 36px;
  }

  @media only screen and (min-width: 0rem) {
    body.dark-mode {

  .product-card {
    background-color: var(--medium);
    // box-shadow: 0 0.025rem 0.15rem white;
    border: 1px solid rgb(118, 118, 118);
  }
  .product-price {
    color: white;
  }
      .icon{
        color: white;
      }


    }
    }


    .modal-button{
      background: none;
      border: none;
    }
</style>