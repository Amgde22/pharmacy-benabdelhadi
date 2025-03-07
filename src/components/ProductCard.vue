<template>
  <div class="product-card" @click="openDialog">
    <!-- Show loading state or placeholder while image loads -->
    <div 
    v-if="isLoading"
    class="product-image" >
          <sl-spinner
             style="
             font-size: 3rem;
             --track-width: 5px;"></sl-spinner>
        </div>

    <img 
    v-else
      :src="mainImageSrc" 
      :alt="name + ' image'" 
      class="product-image"
      @error="handleImageError" 
    /> 

    <p class="product-name">{{ name }}</p>
    <div class="product-tags">
      <p v-for="tag in tags"
       class="tag">{{tag}}</p>

    </div>
    <p class="product-description">{{ description }}

    </p>
    <div class="product-price-and-button bottom-section">
      <span class="product-price">
        {{ formattedPrice }}
        <span class="product-offer-price">{{formattedPromotionPrice}}</span>
      </span>
      
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
    </div>
  </div>

  <!-- dialog -->
  <dialog 
    ref="dialog" 
    :class="[
      'product-dialog',
      {modalVisible: modalVisible}
    ]"
  >
    <div class="dialog-content">
      <!-- Close Dialog Button -->
      <button class="close-button" @click="closeDialog">
        <svg class="close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g fill="none" fill-rule="evenodd">
            <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
            <path fill="currentColor" d="m12 14.122l5.303 5.303a1.5 1.5 0 0 0 2.122-2.122L14.12 12l5.304-5.303a1.5 1.5 0 1 0-2.122-2.121L12 9.879L6.697 4.576a1.5 1.5 0 1 0-2.122 2.12L9.88 12l-5.304 5.304a1.5 1.5 0 1 0 2.122 2.12z" />
          </g>
        </svg>
      </button>

      <!-- product carousel -->
      <sl-carousel 
         mouse-dragging 
         style="--aspect-ratio: 16/9;" 
         ref="carousel"
         class="carousel"
         @sl-slide-change="handleSlideChange"
         @click="openZoomModal"
         >
        <sl-carousel-item v-if="!hasCarouselImages">
          <div 
            v-if="isLoading"
            class="product-image" >
            <sl-spinner
              style="
              font-size: 3rem;
              --track-width: 5px;"></sl-spinner>
          </div>
        </sl-carousel-item>

          <sl-carousel-item
            v-else
            v-for="(image, index) in carouselImages" :key="index"
            class="carousel-product-image"
             >
            <img
              :alt="`${name} - Image ${index + 1}`"
              :src="image.src"
              @error="(e) => handleCarouselImageError(e, index)"
            />
          </sl-carousel-item>

      </sl-carousel>

        <div class="pagination-container">
          <button
          v-for="(image, index) in carouselImages" :key="index"
          :class="['pagination-item',{active:slideIndex == index}]"
            @click="goToSlide(index)"
          ></button>
        </div>

      <!-- other stuff -->
      <div class="dialog-product-informarion-container">
        <h3 class="dialog-product-name product-name">{{ name }}</h3>
        <p class="dialog-product-description"> 
          {{ description }}
        </p>

        <div class="bottom-section">
          <span class="product-price">
            {{ formattedPrice }}
            <span class="product-offer-price">{{formattedPromotionPrice}}</span>
          </span>

          <!-- visit -->
          <!-- <img  :src="LocationIcon.src" alt="visit"> -->
          <div class="icon-container">
            <!-- location  -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7" />
              </svg>
          </div>
        </div>
      </div>
    </div>

  </dialog>

     <!-- image zoom -->
     <dialog 
        ref="imageZoomModal" 
        class="image-modal"
        >
        
          <span @click="closeZoomModal()" class="close">&times;</span>
          <div style="height: 100%;display: grid;place-items: center;">
            <img class="image-modal-content" :src="visibleSlideImageSrc">
          </div>
      </dialog>


</template>

<script setup>
/* ==========================================================================
   Imports
   ========================================================================== */

import { ref, computed, watch, onMounted } from 'vue';
import { lock, unlock } from 'tua-body-scroll-lock'
import '@shoelace-style/shoelace/dist/components/carousel/carousel.js';
import '@shoelace-style/shoelace/dist/components/carousel-item/carousel-item.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js'; // spinner
import placeHolderImage from "@assets/images/placeholder.jpg";



/* ==========================================================================
   Prop Definitions
   ========================================================================== */

// Define the props for the component
const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  productImages: {
    type: Object,
    default: () => ({})
  }
});


/* ==========================================================================
   Reactive State
   ========================================================================== */

const modalVisible = ref(false);
const isLoading = ref(!props.productImages?.image?.src);
const hasImageError = ref(false);
const fallbackImageSrc = placeHolderImage.src;
const mainImageSrc = ref(placeHolderImage.src);
const carouselImages = ref([]);
const isFallbackImage = ref(false);

/* ==========================================================================
   Computed Properties
   ========================================================================== */

const id = computed(() => props.product?.id);
const hasCarouselImages = computed(() => carouselImages.value.length > 0);
const { name, description, price, offer: offerPrice , tags:optionalProductTags, images: additionalImages } = props.product?.data || {};


const tags = computed(()=>{
  if(!Array.isArray(optionalProductTags)) return []

  return Array.from(optionalProductTags)
})
const formattedPrice = computed(() => {
  if (!price) return "Price unavailable";
  const formattedNumber = price.toLocaleString('en-US');
  return `${formattedNumber} DZD`;
});

const formattedPromotionPrice = computed(() => {
  if (!offerPrice) return "";
  const formattedNumber = offerPrice.toLocaleString('en-US');
  return `${formattedNumber} DZD`;
});


/* ==========================================================================
   Dialog Ref
   ========================================================================== */

// Reference to the dialog element
const dialog = ref(null);


/* ==========================================================================
   Methods
   ========================================================================== */


// Handle image updates
function handleImageUpdate(optimizedImages) {
  const optimized_mainImage = optimizedImages.image

  if (optimizedImages && optimizedImages.image && optimizedImages.image.src) {
    mainImageSrc.value = optimized_mainImage.src;
    isLoading.value = false;
    isFallbackImage.value = false;
  } else {
    isLoading.value = true;
    isFallbackImage.value = true;
    // Set a timeout to use fallback if image doesn't load within a reasonable time
    setTimeout(() => {
      if (isLoading.value) {
        mainImageSrc.value = fallbackImageSrc;
        isLoading.value = false;
      }
    }, 3000);
  }
  
  // Update carousel images
  updateCarouselImages(optimizedImages);
}
// Update carousel images
function updateCarouselImages(optimizedImages) { 

  // Start with main image
  const images = [];
  const optimized_mainImage = optimizedImages.image

  if (optimizedImages && optimizedImages.image && optimizedImages.image.src) {
    images.push(optimized_mainImage)
  }


  
  // Add additional images if available
  if (additionalImages && Array.isArray(additionalImages)) {
    additionalImages.forEach(entry => {

      const img = entry.image
      if (img && img.src) {
        images.push(img);
      }
      // image src is a url
      else if(typeof img == "string"){
        images.push({src:img});
      }

    });
  }
// if(name == "Aweasome pc"){
//   console.log(images.map((image)=>image.src));
// }


  carouselImages.value = images;
}

// Handle image loading errors
function handleImageError() {

  hasImageError.value = true;
  mainImageSrc.value = fallbackImageSrc;
  isLoading.value = false;
  isFallbackImage.value = true;
}

function handleCarouselImageError(event, index) {
  carouselImages.value[index] = { src: fallbackImageSrc };
}

// Method to open the dialog
const openDialog = () => {
  dialog.value.showModal();
  modalVisible.value = true;
  lock(dialog.value)
};

// Method to close the dialog
const closeDialog = () => {
  modalVisible.value = false;
  setTimeout(() => {
    unlock(dialog.value)
    dialog.value.close();

  }, 100);
};

// carousel
const carousel = ref(null)
function goToSlide(index) {
  carousel.value.goToSlide(index)
}
// image zoom
const imageZoomModal = ref(null)
const imageZoomOpen = ref(false)

const slideIndex = ref(0)
const visibleSlideImageSrc = computed(()=>{
  const index = slideIndex.value
  const visibleImage = carouselImages.value[index]
  if (visibleImage && visibleImage.src ) {
    return carouselImages.value[index].src
  }
  else return fallbackImageSrc
})
function handleSlideChange(event) {
  slideIndex.value = event.detail.index
}

function openZoomModal() {
  imageZoomModal.value.showModal()
}
function closeZoomModal() {
  console.log('closing')
  imageZoomModal.value.close()
}

/* ==========================================================================
   Watchers
   ========================================================================== */

// Watch for changes in productImages prop
watch(() => props.productImages, (optimizedImages) => {
  if (!optimizedImages.image) {
    console.log("false images , exiting");
    return
  }
  // when optimized images come in , load them
  handleImageUpdate(optimizedImages);
}, { immediate: true, deep: true });


/* ==========================================================================
   Lifecycle Hooks
   ========================================================================== */

// Initialize component
onMounted(() => {
  // Initial setup of images
  handleImageUpdate(props.productImages);
});

</script>


<style lang="less">
/* ==========================================================================
   LESS Variables
   ========================================================================== */

   @shadow-color: rgba(0, 0, 0, 0.2);
@border-radius: 0.5rem;
@golden-color: #ffc107;
@text-color: #333;


/* ==========================================================================
   Product Card Styles (.product-card)
   ========================================================================== */

.product-card {
  font-size: 0.8em;
  box-shadow: 0 0.25rem 0.5rem @shadow-color;
  border-radius: @border-radius;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: white;
  transition: transform 0.2s ease-in-out;
  width: 100%;
  max-width: 350px;

  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 450px;
  cursor: pointer;
}

.product-image {
  width: 100%;
  height: auto;
  max-height: 200px;
  border-radius: @border-radius;
  margin-bottom: 0.75rem;
  object-fit: contain; // Ensure image fills container without distortion
  aspect-ratio: 16/9; //Maintain the aspect ratio

  display: grid;
  place-items: center;
}

.product-name {
  color: var(--headerColor);
  text-transform: capitalize;
  font-weight:bold;
  font-size: 1.25em;
}
.product-tags{
  display: flex;
  margin-top: 4px;
  margin-bottom: 8px;
  gap: 4px;

  & .tag{
    flex: 0 0 auto;
    font-size: 1.1em;
    text-transform: capitalize;
    padding: 0.2em 1.25em;
    border-radius: 100vw;

    background-color: var(--primary);
    color: white;
  }

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
  font-size: 1.35em;
  font-size: clamp(19px, 16.21px + 0.99vw, 24px);
  font-weight: bolder;

  & .product-offer-price{
    font-size: .8em;
    position: relative;
    &::before{
      content: "";
      position: absolute;
      height: 2px;
      width: 100%;
      top: 0;bottom: 0;
      background-color: currentColor;
      margin: auto;
    }
  }
}

.icon {
  cursor: pointer;
  color: var(--primary);
  width: 36px;
  height: 36px;
}

.bottom-section {
  margin-top: auto;
}



/* ==========================================================================
   Product Dialog Styles (.product-dialog)
   ========================================================================== */

.product-dialog {
  --bottom-section-height: 44px;
  position: fixed;
  inset: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  margin: auto;
  border: none;
  background-color: transparent;
  transition: transform 200ms ease-in-out; // Reduced Transition

  &:not(.modalVisible) {
    animation: popout 100ms forwards;
  }

  &.modalVisible {
    animation: popup 200ms forwards;
  }
}

/* Backdrop styling */
.product-dialog::backdrop {
  background: rgba(0, 0, 0, 0.8);
  transition: opacity 200ms linear;
  opacity: 1;
}

.product-dialog:not(.modalVisible)::backdrop {
  opacity: 0;
}




.dialog-content {
  background-color: #fff;
  width: 100%;
  max-width: 640px;
  height: 100%;
  max-height: 100vh;
  position: relative;
  overflow-y: auto;
  margin: auto;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
}

.close-button {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  transition: opacity 150ms ease-in-out;
  transform: scale(0.85);
  z-index: 100;
  background-color: var(--danger);
  opacity: 0.8;

  &:hover,
  &:focus {
    opacity: 1;
  }

  .close-icon {
    color: white;
    width: 50%;
    height: 50%;
  }
}

.dialog-product-image {
  width: 100%;
  height: auto;
}

.dialog-product-name,
.dialog-product-price {
  margin: 10px 0;
  flex-grow: 0;
}


.dialog-product-informarion-container {
  padding: 8px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative; // absolute stuff
  padding-bottom: var(--bottom-section-height);
  overflow: hidden;
}
.icon-container{
  margin-left: auto;
  padding-right: 16px;
  display: flex;
  align-items: center;

  & svg{
    --size : clamp(20px, 16.21px + 0.99vw, 24px) ;
    width: var(--size);
    height: var(--size);

  }
}
.dialog-product-description {
  white-space: pre-line;
  border-top: 2px solid var(--medium);
  padding: 8px 4px;
  overflow-y: auto;
}

.dialog-product-informarion-container .bottom-section {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: var(--bottom-section-height);
  display: flex;
  align-items: center;
  padding: 0 16px;
  padding: 0 clamp(8px, 3.33px + 1.67vw, 16px);
}

/* ==========================================================================
   Mobile Dialog
   ========================================================================== */
   @media only screen and (max-width: 1023px) {
    .product-dialog {

      margin: 0;
      max-width: none;
      max-height: none;

    }  
  }


/* ==========================================================================
   Carousel Styles (.carousel)
   ========================================================================== */

.carousel {
  position: relative;
  z-index: 1;

  & img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }

  // &::part(pagination-item),.pagination-item {
  //   --size: 14px;
  //   width: var(--size);
  //   height: var(--size);
  // }

  // &::part(pagination-item--active),.pagination-item {
  //   background-color: var(--medium);
  // }
}
.pagination-container{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}
.pagination-item {
    --size: 16px;
    width: var(--size);
    height: var(--size);
    border: none;
    border-radius: 100%;
    background-color: rgb(161, 161, 161);
    &:hover{
      opacity: 0.85;
    }
  }
  .pagination-item.active {
    background-color: var(--medium);
  }
/* ==========================================================================
   Dark Mode Styles (body.dark-mode)
   ========================================================================== */

@media only screen and (min-width: 0rem) {
  body.dark-mode {
    .product-card,
    .dialog-content {
      background-color: var(--medium);
      border: 1px solid rgb(118, 118, 118);
    } 

    .product-tags .tag{
      background-color: white;
      color:var(--medium) ;
      
    }

    .product-price {
      color: white;
    }

    .icon {
      color: white;
    }

    .dialog-product-description {
      border-top: 2px solid currentColor;
    }

    .pagination-item {
      background-color: var(--dark);
    }

    .pagination-item.active {
      background-color: rgb(213, 213, 213) !important; 
    }
  }
}


// image zoom
/* The Modal (background) */
.image-modal {

  margin: 0;
  border: none;

  position: fixed; /* Stay in place */
  z-index: 100; /* Sit on top */
  inset: 0 !important;
  width: 100%; /* Full width */
  max-width: none;
  height: 100%; /* Full height */
  max-height: none;
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.9); /* Black w/ opacity */


}

/* Modal Content (image) */
.image-modal-content {
  margin: auto;
  display: block;
  max-width: 80%;
  max-height: 80%;
}


/* Add Animation */
.image-modal-content {  
  -webkit-animation-name: zoom;
  -webkit-animation-duration: 200ms;
  animation-name: zoom;
  animation-duration: 200ms;
  animation-timing-function: ease-out;
}

@-webkit-keyframes zoom {
  from {-webkit-transform:scale(0)} 
  to {-webkit-transform:scale(1)}
}
@keyframes zoom {
  from {transform:scale(0)} 
  to {transform:scale(1)}
}

/* The Close Button */
.close {
  position: absolute;
  top: 15px;
  right: 35px;
  color: #f1f1f1;
  font-size: 40px;
  font-weight: bold;
  transition: 0.3s;
}

.close:hover,
.close:focus {
  color: #bbb;
  text-decoration: none;
  cursor: pointer;
}

/* 100% Image Width on Smaller Screens */
@media only screen and (max-width: 700px){
  .image-modal-content {
    width: 100%;
    max-width: none;
    max-height: none;
  }
}

</style>




