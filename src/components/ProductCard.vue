
<template>
  <div class="product-card" @click="openDialog">
    <div class="product-image-container">
      <img 
        loading="lazy"
        :src="mainImageSrc" 
        :alt="name + ' image'" 
        class="product-image"
        @error="handleImageError" 
      /> 
      <img 
        loading="lazy"
        :src="mainImageSrc" 
        :alt="name + ' image'" 
        class="product-image-background"
        @error="handleImageError" 
      /> 
    </div>

    <p class="product-name">{{ name }}</p>

    <div class="product-tags">
      <p v-if="gender" class="tag">{{gender}}</p>
      <p v-for="tag in tags" class="tag">{{tag}}</p>
    </div>

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
    @close="unlock"
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
      <div class="carousel-container">
        <Slider 
          v-if="slider"
          :name="name"
          :carousel-images="carouselImages" />
        
        <Carousel
          v-else
          :name="name"
          :carousel-images="carouselImages" />
      </div>

      <!-- dialog/modal product name-->
      <div class="dialog-product-informarion-container">
        <p class="dialog-product-name product-name">
          {{ name }} : {{ formattedPrice }} <span class="dialog-offer-price">{{ formattedPromotionPrice }} </span> 
        </p>

        <!-- dialog/modal product footer-->
        <div class="dialog-footer bottom-section">
          <CartFooter
            :product="product.data"
            :color="selectedVariant?.color"
            :chosenSize="selectedVariant?.chosenSize"
            :chosenVariant="selectedVariant"
            v-if="cart" />
          <span v-else class="product-price">
            {{ formattedPrice }}
            <span class="product-offer-price">{{formattedPromotionPrice}}</span>
          </span>

          <!-- visit -->
          <!-- <img  :src="LocationIcon.src" alt="visit"> -->
          <div class="icon-container">
            <!-- whatsapp -->
            <a class="dialog-link whatsapp-icon-holder" :href="whatsappLink" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"  viewBox="0 0 48 48">
                <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path><path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path><path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path><path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path><path fill="#fff" fill-rule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clip-rule="evenodd"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>


<script setup>
/* ==========================================================================
   Imports
   ========================================================================== */

import { ref, computed, watch, onMounted, toValue } from 'vue';
import ClothingVariantSelect from "@components/productCardMiniComponents/ClothingVariantSelect.vue"
import CartFooter from "@components/productCardMiniComponents/CartFooter.vue"
import { lock, unlock } from 'tua-body-scroll-lock'
import placeHolderImage from "@assets/images/placeholder.jpg";
// assets
import data from "@data/client.json"
import Carousel from "@components/productCardMiniComponents/Carousel.vue"
import Slider from "@components/productCardMiniComponents/Slider.vue"
import { CheckIfClothingProduct } from '@/js/utils';
import ClothingInfo from "@components/productCardMiniComponents/ClothingInfo.vue"


const googleMapsLink = data.address.mapLink

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
  },
  slider:{
    type:Boolean,
    required:false
  },
  cart:{
    type:Boolean,
    default:false,
    required:false
  }
});




/* ==========================================================================
   Reactive State
   ========================================================================== */


const modalVisible = ref(false);
const hasImageError = ref(false);
const fallbackImageSrc = placeHolderImage.src;
const mainImageSrc = ref(props.productImages.image.src);

const isFallbackImage = ref(false);
const { 
   name,
   description,
   price,
   offer: offerPrice ,
   tags:optionalProductTags,
   images: additionalImages,
   variants ,
   gender
  } = props.product?.data || {};

  const productHasVariants = Array.isArray(variants)
  const isClothingProduct = CheckIfClothingProduct(props.product?.data)


/* ==========================================================================
   life-cycle events
   ========================================================================== */


/* ==========================================================================
   Computed Properties
   ========================================================================== */

  const selectedVariant = ref(productHasVariants ? variants[0] : null)

const carouselImages = computed(() => {

  const images = [];
    // main image

    if (!productHasVariants) {
      images.push(props.productImages.image)
      
    }


    const restOfImages = productHasVariants == true ? 
      selectedVariant.value.images
      : additionalImages

  // Add additional images if available
  if (restOfImages && Array.isArray(restOfImages)) {
    restOfImages.forEach(entry => {

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
  
  return images



});

const whatsappLink = computed(() => {
    const message = `لدي استفسار حول \n ${toValue(name)} \n`;
    const encodedMessage = encodeURIComponent(message); // URL-encode the message
    const hasParams = data.whatsappLink.includes('?');
    const separator = hasParams ? '&' : '?';
    const link = `${data.whatsappLink}${separator}text=${encodedMessage}`;

    return link
});

const tags = computed(()=>{
  if(!Array.isArray(optionalProductTags)) return []
  return Array.from(optionalProductTags)
})
function formatCurrency (value, currency = 'DZD', locale = 'en-US') {
  if (value === null || value === undefined) return null;
  
  // Handle both number and string inputs
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check for valid number
  if (isNaN(numericValue)) return null;
  
  // Round to avoid floating point precision issues
  const roundedValue = Math.round(numericValue);
  
  // Format the number according to locale
  const formattedNumber = roundedValue.toLocaleString(locale);
  
  return `${formattedNumber} ${currency}`;
};
const formattedPrice = computed(() => {
  return formatCurrency(price) || "Price unavailable";
});
const formattedPromotionPrice = computed(() => {
  return formatCurrency(offerPrice) || "";
});





/* ==========================================================================
   Dialog Ref
   ========================================================================== */

// Reference to the dialog element
const dialog = ref(null);


/* ==========================================================================
   Methods
   ========================================================================== */




// Handle image loading errors
function handleImageError() {

  hasImageError.value = true;
  mainImageSrc.value = fallbackImageSrc;
  isFallbackImage.value = true;
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


function selectVariant(variant) {
  selectedVariant.value = {...variant}
}

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
/* Mobile - 360px */
@media only screen and (min-width: 0rem) {
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
.product-image-container{
  position: relative;
  max-height: 200px;
  border-radius: @border-radius;
  aspect-ratio: 16/9; //Maintain the aspect ratio
  isolation: isolate;
  overflow: hidden;
  margin-bottom: 16px;
  & img{
    mix-blend-mode: multiply;
  }

.product-image-background {
  position: absolute;
  top: 0;left: 0;
  display: block;
  // border: 1px solid red;
  z-index: -1;
  width: 100%;height: 100%;
  object-fit: cover; // Cover the container area
  filter: blur(10px); // Apply blur (adjust px as needed)
  transform: scale(1.1); // Slightly scale up to avoid blurred edges showing artifacts
  z-index: -1; // Ensure it's behind the main image
  opacity: 0.5;


}


}
.product-image {
  height: 100%;
  display: block;
  margin: auto;
  margin-bottom: 0.75rem;
  object-fit: contain; // Ensure image fills container without distortion
  z-index: 1;
}


.product-name {
  color: var(--headerColor);
  text-transform: capitalize;
  font-weight:bold;
  font-size: 1.25em;
  margin-bottom: var(--spacing-xs);



}
.product-tags{
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: var(--spacing-m);

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
  // keep in em
  font-size: 1.2em;
  color: @text-color;
  line-height: 1.4;
  margin-bottom: auto;
  overflow: hidden;
  max-height: 3.8em;
  font-weight: 400;
}

.product-price-and-button {

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
   Carousel Styles (.carousel)
   ========================================================================== */

   .carousel-container{
    padding-top: 16px;
    padding-bottom: 12px;
    background-color: rgba(0, 0, 0, 0.059);

    max-height: 300px;
   }

/* ==========================================================================
   Product Dialog Styles (.product-dialog)
   ========================================================================== */

.product-dialog {
  --bottom-section-height: 50px;
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

  position: relative;
  overflow-y: auto;
  margin: auto;
  display: flex;
  flex-direction: column;

  border-radius: 15px;

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
  font-size: 1.35em;
  color: var(--sl-color-neutral-700) !important;
  margin: var(--spacing-xs) 0;
  margin-top:var(--spacing-s) ;
  flex-grow: 0;

  .dialog-offer-price{
    font-size: 0.85em;
    opacity: 0.6;
    text-decoration:line-through;
  }

}
.dialog-product-description {
  white-space: pre-line;
  border-top: 2px solid var(--medium);
  padding: 8px 4px;
  overflow-y: auto;
  text-transform: capitalize; 
  font-size: 1.2em;
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
--icon-size:30px;

  margin-left: auto;
  padding-right: 4px;
  padding-left: 4px;
  display: flex;
  align-items: center;
  gap: 8px;

// location + whatsapp

// location
  & .dialog-link{
    display: grid;
    place-items: center;

    box-sizing: content-box;
    width: var(--icon-size);
    height: var(--icon-size);
    border-radius: 100%;



    & svg{
      max-width: 100%;
      max-height: 100%;
    }
  }
  & .whatsapp-icon-holder {
    width: calc( var(--icon-size ) + 10px);
    height: calc( var(--icon-size ) + 10px);
  }
  & .location-icon-holder {
    background-color: var(--medium);
    color: white;

    & svg{
      --size : clamp(20px, 16.21px + 0.99vw, 24px) ;
      width: var(--size);
      height: var(--size);
    }
  }
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
  padding-top: 4px;
  box-shadow: 0 -8px 6px -1px rgba(255, 255, 255,0.8);
  background-color: white;

}
}

/* Tablet - 768px */
@media only screen and (min-width: 768px) {
  .icon-container{
    --icon-size:35px;
    padding-right: 16px;
    gap: 16px;
  }
  .product-dialog.modalVisible{
    display: grid;
  }
  .dialog-content {
    max-height: 760px;
  }
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
   Dark Mode Styles (body.dark-mode)
   ========================================================================== */

@media only screen and (min-width: 0rem) {
  body.dark-mode {
    .product-card,
    .dialog-content {
      background-color: var(--color-primary-700);
      box-shadow: none;

    } 

    .product-tags .tag{
      background-color: var(--color-primary-500);
      color:#eee ;
      
    }
    .product-price,.icon {
      color:#eee ;

    }


    .dialog-product-name,
    .dialog-product-price {
      color: var(--sl-color-neutral-200) !important;
    }
    .dialog-product-description {
      border-top: 4px solid rgba(255, 255, 255, 0.489);
      font-family: sans-serif; 
      font-size: 16px;
      opacity: 0.9;


    }





    .location-icon-holder{
      border: 2px solid white;
      background-color: white;
      & svg{
        color: black;
        transform: scale(1.2) translateY(1px);
      }
    }
    .dialog-product-informarion-container .bottom-section {
      border-top:2px solid rgba(255, 255, 255, 0.39);
      box-shadow: none;
      background-color: var(--medium);
    }

  }
}




</style>


