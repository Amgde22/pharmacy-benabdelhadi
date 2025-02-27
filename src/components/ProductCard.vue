<template>
  <div class="product-card" @click="openDialog">
    <img :src="mainImage.src" :alt="name" class="product-image" />
    <h3 class="product-name">{{ name }}</h3>
    <p class="product-description">{{ description }}</p>
    <div class="product-price-and-button bottom-section">
      <span class="product-price">{{ formattedPrice }}</span>

      <svg  class="icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
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
      <!-- Full-Screen Dialog -->
      <dialog ref="dialog" 
      :class="[
        'product-dialog',
        {modalVisible:modalVisible}
        ]">
      <div class="dialog-content">
        <!-- Close Dialog Button -->
        <button class="close-button" @click="closeDialog">
            <svg class="close-icon"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g fill="none" fill-rule="evenodd">
                <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                <path fill="currentColor" d="m12 14.122l5.303 5.303a1.5 1.5 0 0 0 2.122-2.122L14.12 12l5.304-5.303a1.5 1.5 0 1 0-2.122-2.121L12 9.879L6.697 4.576a1.5 1.5 0 1 0-2.122 2.12L9.88 12l-5.304 5.304a1.5 1.5 0 1 0 2.122 2.12z" />
              </g>
            </svg>
        </button>

        <!-- product carousel -->
        <!-- <img  :src="imageUrl" :alt="name" class="dialog-product-image" /> -->
        <sl-carousel class="carousel" autoplay  pagination style="--aspect-ratio: 16/9;">
            <sl-carousel-item >
              <img
                alt="The sun shines on the mountains and trees (by Adam Kool on Unsplash)"
                :src="placeHolderImage.src"
              />
            </sl-carousel-item>
            <sl-carousel-item >
              <img
                alt="The sun shines on the mountains and trees (by Adam Kool on Unsplash)"
                :src="placeHolderImage.src"
              />
            </sl-carousel-item>
            <sl-carousel-item >
              <img
                alt="The sun shines on the mountains and trees (by Adam Kool on Unsplash)"
                :src="placeHolderImage.src"
              />
            </sl-carousel-item>


</sl-carousel>

        <!-- other stuff -->
        <div class="dialog-product-informarion-container">

          <h3 class="dialog-product-name product-name">{{ name }}</h3>
          <p class="dialog-product-description "> 
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cupiditate, voluptas sunt minus id officiis vel expedita! Cupiditate dicta, voluptate error alias magni natus earum repellat quae rerum cumque explicabo adipisci nam nobis totam illo laudantium mollitia blanditiis distinctio provident perspiciatis voluptas. Distinctio eveniet ea eaque veniam aliquam laboriosam ex rem fugit nihil, pariatur perferendis eos.
            {{ description }}</p>

          <div class="bottom-section">
            <span class="dialog-product-price product-price">{{ formattedPrice }}</span>
          </div>
          
        </div>
      </div>
    </dialog>

    
</template>

<script setup>
import {ref, computed, defineProps } from 'vue';
import '@shoelace-style/shoelace/dist/components/carousel/carousel.js';
import '@shoelace-style/shoelace/dist/components/carousel-item/carousel-item.js';
import placeHolderImage from "@assets/images/nature.jpeg"

const modalVisible = ref(false)






// Define the props for the component
const props = defineProps({
  product:{
    type:Object
  },
  productImages:{
    type:Object
  }
});
const id = props.product.id
const {name , description , price , offer:offerPrice  , images:aditionalImages} = props.product.data
console.log(id, "images :");
console.log(props.productImages);
// havent resolved yet
const { image:mainImage } = props.productImages

// format Data
const formattedPrice = computed(() => {
  const formattedNumber = price.toLocaleString('en-US'); // Convert to string and format with commas
  return `${formattedNumber} DZD`
});
const formattedPromotionPrice = computed(() => {
  const formattedNumber = offerPrice.toLocaleString('en-US'); // Convert to string and format with commas
  return `${formattedNumber} DZD`
});


// Reference to the dialog element
const dialog = ref(null);

// Method to open the dialog
const openDialog = () => {
  dialog.value.showModal();
  modalVisible.value = true
};

// Method to close the dialog
const closeDialog = () => {
  modalVisible.value = false
  setTimeout(() => {
  dialog.value.close();
    
  }, 100);
};
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
    object-fit: contain; // Ensure image fills container without distortion
    aspect-ratio: 16/9; //Maintain the aspect ratio, even if width and height are not set
  }

  .product-name {
    font-size: 1.25em;
    margin-bottom: 0.5rem;


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

  .bottom-section{
    margin-top: auto;
  }







// -------- dialog
.product-dialog {
  --bottom-section-height:44px;
  position: fixed;
  inset: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  margin: auto;
  border: none;
  background-color: transparent;

  transition: transform 200ms ease-in-out;



  &:not(.modalVisible){
    animation: popout 100ms forwards;
  }
  &.modalVisible{
    animation: popup 200ms forwards;
  }
}

.dialog-content {
  background-color: #fff;

  width: 100%;
  max-width: 640px;
  height: 100%;
  max-height: 100%;
  position: relative;
  overflow-y: auto;margin: auto;

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
  z-index: 1000;

  background-color: var(--danger);
  opacity: 0.8;
  &:hover,&:focus{
    opacity: 1;
  }
    .close-icon{
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

.dialog-product-informarion-container{
  padding: 8px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  // absolute stuff
  position: relative;
  padding-bottom: var(--bottom-section-height);
  overflow: hidden;


}
.dialog-product-description{
  border-top: 2px solid var(--medium);

  padding: 4px 0;
  overflow-y: auto;
}

.dialog-product-informarion-container .bottom-section{
    position: absolute;
    bottom: 0;left: 0;right: 0;width: 100%;
    height: var(--bottom-section-height);
    display: flex;
    align-items: center;
    padding: 0 16px;
  }
/* Backdrop styling */
.product-dialog::backdrop {
  background: rgba(0, 0, 0, 0.8);
}

// carousel

// dark mode
@media only screen and (min-width: 0rem) {
    body.dark-mode {

      .product-card , .dialog-content {
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

      .dialog-product-description{
        border-top: 2px solid currentColor;
      }

      .carousel::part(pagination-item){
          background-color: var(--dark);

        }
        
        .carousel::part(pagination-item--active){
          background-color:rgb(213, 213, 213);
        }
    }
    }


</style>



