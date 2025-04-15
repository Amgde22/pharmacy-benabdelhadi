<template>
  <section >

    <div class="container">
      <div v-if="items.length > 0" class="cart-items-container">
        <div class="cart-items-header">
          <p class="summary">order summary</p>
        <div  class="subtotal order-info">
          <span>Subtotal:</span>
          <strong>{{ formatCurrency(subtotal, currency) }}</strong>
        </div>
        <div class="shipping order-info">
          <span>Shipping:</span>
          <strong>{{ getShippingCost() }}</strong>
        </div>
        </div>


        <CartItemDisplay
            v-for="(item, index) in items"
            :key="item.id"
            :item="item"
            :index="index"
            @increase-quantity="handleIncreaseQuantity"
            @decrease-quantity="handleDecreaseQuantity"
            @remove-item="handleRemoveItem"
            />
        </div>
      <sl-card class="checkout-card">
        <div slot="header">
          Checkout Information
        </div>
        <!-- Standard HTML form -->
        <form
          ref="form"
          data-netlify="true"
          name="checkout-form-html"
          @submit.prevent="handleSubmit"
          method="post"
          class="form-content"
          novalidate
        >
          <!-- Netlify hidden input -->
          <input type="hidden" name="form-name" value="checkout-form-html" />
          <!-- Full Name -->
          <div class="form-group">
            <label for="fullname">Full Name</label>
            <input
            pattern="[\s\S]*"
              type="text"
              name="fullname"
              id="fullname"
              class="form-input"
              required
              aria-describedby="fullname-help"
              placeholder=" "
            />
            <small id="fullname-help" class="help-text">Please enter your full name</small>
          </div>
          <!-- Phone Number -->
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              class="form-input"
              inputmode="tel"
              placeholder="e.g., 05xxxxxxxx / 06xxxxxxxx / 07xxxxxxxx"
              required
              pattern="^(05|06|07)\d{8}$"
              title="Must be 10 digits starting with 05, 06, or 07."
              aria-describedby="phone-help"
            />
            <small id="phone-help" class="help-text">Enter a valid Algerian phone number (starts with 05, 06, or 07)</small>
          </div>
          <!-- Wilaya Selection -->
          <div class="form-group">
            <label for="wilaya-select">Wilaya</label>
            <div class="select-wrapper"> <!-- Wrapper for custom arrow styling -->
              <select
                name="wilaya"
                id="wilaya-select"
                class="form-select"
                required
                aria-describedby="wilaya-help"
                placeholder="wilaya"
              >
                <option value="" disabled selected>-- Select your Wilaya --</option> <!-- Placeholder option -->
                <option v-for="(wilaya, index) in wilayas" :key="wilaya" :value="wilaya">
                  {{ index + 1 }}. {{ wilaya }}
                </option>
              </select>
            </div>
            <small id="wilaya-help" class="help-text">Select your Wilaya</small>
          </div>
          <!-- Baladiya (Commune) -->
          <div class="form-group">
            <label for="baladiya">Baladiya / Commune</label>
            <input
              type="text"
              name="baladiya"
              id="baladiya"
              class="form-input"
              required
              aria-describedby="baladiya-help"
              placeholder=" "
            />
            <small id="baladiya-help" class="help-text">Enter your specific commune or town</small>
          </div>
          <!-- Address -->
          <div class="form-group">
            <label for="address">Address</label>
            <input
              type="text"
              name="address"
              id="address"
              class="form-input"
              required
              aria-describedby="address-help"
              placeholder=" "
            />
            <small id="address-help" class="help-text">Enter your street address, building, etc.</small>
          </div>
          <!-- Notes -->
          <div class="form-group">
            <label for="notes">Notes (Optional)</label>
            <textarea
              name="notes"
              id="notes"
              class="form-textarea"
              rows="4"
              aria-describedby="notes-help"
            ></textarea>
            <small id="notes-help" class="help-text">Any special delivery instructions or notes?</small>
          </div>
          <!-- hidden bought products text area -->
          <textarea
              name="bought_products"
              id="bought_products"
              rows="6"
              v-model="shopKeeperMessage"
              readonly
              hidden
              aria-hidden
            ></textarea>
          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="items.length === 0"
            class="button button-primary submit-button"
          >
            <!-- Keep sl-icon if Shoelace core is still available -->
            <span slot="prefix" style="margin-right: 0.5em; vertical-align: middle;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2s-.9-2-2-2m10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2s2-.9 2-2s-.9-2-2-2m-8.9-5h7.45c.75 0 1.41-.41 1.75-1.03L21 4.96L19.25 4l-3.7 7H8.53L4.27 2H1v2h2l3.6 7.59l-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7zM12 2l4 4l-4 4l-1.41-1.41L12.17 7H8V5h4.17l-1.59-1.59z"/></svg>
            </span>
            Place Order
          </button>
        </form>
      </sl-card>
    </div>
</section>

</template>

<script setup>
import { ref ,computed} from "vue";
import CartItemDisplay from "@components/CartComponents/CartItemDisplay.vue"
import {currency} from "@data/client.json"
import { formatCurrency , getShippingCost } from "@/js/utils";
// --- Only import Shoelace components still in use ---
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';

import { useStore } from '@nanostores/vue';
// --- Store Imports ---
import {
  $cartItems,
  $subtotal,
  $totalItems,
  updateItemQuantity,
  removeItemFromCart,
  getImageUrl,
} from '@/js/CartStore'; // Adjust path if needed

const items = useStore($cartItems);
const subtotal = useStore($subtotal);
const totalItems = useStore($totalItems);

// --- Algerian Wilayas (remains the same) ---
const wilayas = ref([
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar', 'Blida', 'Bouïra',
  'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Algiers', 'Djelfa', 'Jijel', 'Sétif', 'Saïda',
  'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem', "M'Sila", 'Mascara',
  'Ouargla', 'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt',
  'El Oued', 'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent', 'Ghardaïa',
  'Relizane', 'Timimoun', 'Bordj Badji Mokhtar', 'Ouled Djellal', 'Béni Abbès', 'Ain Salah', 'Ain Guezzam',
  'Touggourt', 'Djanet', "El M'Ghair", 'El Menia'
]);

const shopKeeperMessage = computed(()=>{
  const header = "Bought Products"
  const warning = "ALWAYS RE-CHECK THE INFORMATION"
  const products_message = items.value.map( (item,index)=>
  `Product  ${index + 1} : ${item.previousPrice? '(Promotion) ' + item.previousPrice + ' --> ' +item.price: '' } \n
  ${item.name} x ${item.quantity} \n
  ${formatCurrency(item.price , currency)} x ${item.quantity} = ${formatCurrency(item.price * item.quantity , currency)} \n
  `)
  .join("\n")
  const totalPriceMessage = `Prix Total : ${subtotal.value}`
  const Complete_message = [header,warning,products_message,totalPriceMessage].join("\n")
  return Complete_message
  
})


// --- Form Logic (remains the same) ---
const form = ref(null);

// --- Cart Actions Handlers (These now receive itemId from the event) ---
const handleIncreaseQuantity = (itemId) => {
  // Logic remains the same, calls the store function
  const item = items.value.find(i => i.id === itemId);
  if (item) {
    updateItemQuantity(itemId, item.quantity + 1);
  }
};

const handleDecreaseQuantity = (itemId) => {
  // Logic remains the same, calls the store function
  const item = items.value.find(i => i.id === itemId);
  // The child component already prevents emitting if quantity is 1,
  // but double-checking here doesn't hurt.
  if (item && item.quantity > 1) {
    updateItemQuantity(itemId, item.quantity - 1);
  }
};

const handleRemoveItem = (itemId) => {
  // Logic remains the same, calls the store function
  // Optional: Add confirmation dialog here if desired
  console.log(`Handling remove item event for: ${itemId}`);
  removeItemFromCart(itemId);
};


const handleSubmit = async () => {
  if (!form.value) return;

  // Standard HTML elements also have reportValidity
  const controls = Array.from(form.value.elements).filter(el => typeof el.reportValidity === 'function');
  let allValid = true;
  for (const control of controls) {
      if (!control.reportValidity()) {
          allValid = false;
          // Find the associated form-group and add an error class? (Optional enhancement)
      }
  }

  if (!allValid) {
      console.log("Form validation failed.");
      // Focus the first invalid field (optional)
      const firstInvalid = controls.find(el => !el.checkValidity());
      firstInvalid?.focus();
      return;
  }

  console.log("Form is valid, proceeding with submission...");
  const formData = new FormData(form.value);

  console.log("FormData Entries:");
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
  console.log("URL Encoded:", new URLSearchParams(formData).toString());

  // --- Netlify Submission Logic (remains the same) ---
  try {
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString()
    });

    if (response.ok) {
        alert('Order placed successfully!');
        form.value.reset();


    } else {
        alert(`Order submission failed: Server responded with status ${response.status}`);
    }
  } catch (error) {
    console.error("Form submission error:", error);
    alert('Order submission failed: ' + error.message);
  }
};
</script>

<style lang="less" scoped>
// Define some base variables (adjust colors/sizes as needed)
@input-padding-y: 0.6rem;
@input-padding-x: 0.8rem;
@font-size-base: 1rem;
@line-height-base: 1.5;
@border-width: 1px;
@border-color: #ced4da; // A common light grey border
@border-radius: 0.25rem;
@input-bg: #fff;
@input-color: #212529; // Dark text color
@input-focus-border-color: #86b7fe; // Light blue on focus
@input-focus-box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25); // Subtle glow on focus
@input-placeholder-color: #6c757d; // Muted placeholder
@input-invalid-border-color: #dc3545; // Red for errors
@help-text-color: #6c757d;
@help-text-font-size: 0.875em;
@label-margin-bottom: 0.5rem;
@button-padding-y: 0.6rem;
@button-padding-x: 1rem;
@button-primary-bg: #0d6efd; // Bootstrap primary blue
@button-primary-color: #fff;
@button-primary-border-color: @button-primary-bg;
@button-primary-hover-bg: darken(@button-primary-bg, 7.5%);
@button-primary-hover-border-color: darken(@button-primary-border-color, 10%);
@button-primary-active-bg: darken(@button-primary-bg, 10%);
@button-primary-active-border-color: darken(@button-primary-border-color, 12.5%);

/* Mobile - 320px */
@media only screen and (min-width: 0) {
.container{
  display: grid;
  justify-items: center;
  gap:16px;
}
.cart-items-container{
  max-width: 450px;
  grid-row: 2;
}
.cart-items-header{
  padding:0 24px ;
  margin-bottom: 1.5em;

}
.order-info,
.summary{
  padding:0.5em 0;

}


.summary{
  font-size: 1.4em;

  font-weight:800;
  text-transform: capitalize;
}
.order-info{
  display: flex;
  justify-content: space-between;
  align-items: center;

  & strong{
    padding: 0.5em;
    background-color: black;
    color: white;
  }
  &:last-of-type{
    padding-bottom: 1em;
    border-bottom: 1px solid rgb(62, 62, 62) ;
  }
}
.checkout-card {
  max-width: 600px;

  // Inherits sl-card styling
}
.checkout-card::part(header) {
  padding: 20px;
  font-size: 1.6em;
  background-color: rgb(239, 239, 239) ;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem; // Spacing between form groups
}

.form-group {
  margin-bottom: 0; // Use gap from .form-content for spacing

  label {
    display: block;
    margin-bottom: @label-margin-bottom;
    font-weight: 500; // Slightly bolder label
  }
}

// Common styling for input, select, textarea
.form-input,
.form-select,
.form-textarea {
  display: block;
  width: 100%;
  padding: @input-padding-y @input-padding-x;
  font-size: @font-size-base;
  font-weight: 400;
  line-height: @line-height-base;
  color: @input-color;
  background-color: @input-bg;
  background-clip: padding-box;
  border: @border-width solid @border-color;
  appearance: none; // Remove default system appearance
  border-radius: @border-radius;
  transition: border-color 0.15s ease-in-out;

  &::placeholder {
    color: @input-placeholder-color;
    opacity: 1; // Firefox needs this
  }

  &:focus {
    color: @input-color;
    border-color: @input-focus-border-color;      
    outline: 0;
    box-shadow: @input-focus-box-shadow;
  }

  // Style for validation feedback
  // Uses pseudo-class triggered by reportValidity() or browser default

  &:invalid:not(:placeholder-shown,.form-select){
     border-color: @input-invalid-border-color;



    &:focus{
      box-shadow: 0 0 0 0.25rem rgba(red(@input-invalid-border-color), green(@input-invalid-border-color), blue(@input-invalid-border-color), 0.25);
    }
  }


}

// Specific select styling
.select-wrapper {
  position: relative; // For positioning the custom arrow

  .form-select {
    padding-right: @input-padding-x * 2.5; // Make space for the arrow
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e"); // Simple chevron down arrow SVG
    background-repeat: no-repeat;
    background-position: right @input-padding-x center;
    background-size: 16px 12px;
  }
}


// Specific textarea styling
.form-textarea {
  resize: vertical; // Allow vertical resize only
  min-height: calc(@line-height-base * 2em + @input-padding-y * 2 + @border-width * 2); // Default height for a few lines
}


.help-text {
  display: block; // Ensure it takes its own line
  margin-top: 0.25rem;
  font-size: @help-text-font-size;
  color: @help-text-color;
}

// Base button styles
.button {
  display: inline-block;
  font-weight: 400;
  line-height: @line-height-base;
  color: @input-color; // Default text color
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  background-color: transparent;
  border: @border-width solid transparent;
  padding: @button-padding-y @button-padding-x;
  font-size: @font-size-base;
  border-radius: @border-radius;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    outline: 0;
    // Add focus ring styling if desired, matching input focus
    box-shadow: @input-focus-box-shadow;
  }

  // Optional: Add disabled styles
  &:disabled {
    pointer-events: none;
    opacity: 0.65;
  }
}

// Primary button variant
.button-primary {
  color: @button-primary-color;
  background-color: @button-primary-bg;
  border-color: @button-primary-border-color;

  &:hover {
    color: @button-primary-color;
    background-color: @button-primary-hover-bg;
    border-color: @button-primary-hover-border-color;
  }

  &:active {
    color: @button-primary-color;
    background-color: @button-primary-active-bg;
    border-color: @button-primary-active-border-color;
  }

  // Optional: Adjust focus ring for primary button
   &:focus {
     box-shadow: 0 0 0 0.25rem rgba(red(@button-primary-bg)+20, green(@button-primary-bg)+20, blue(@button-primary-bg)+20, 0.5); // Example focus shadow
   }
}

.submit-button {
  margin-top: 1rem; // Keep original margin
  align-self: flex-start; // Keep original alignment

  // Style the icon within the button if needed
  span {
    display: inline-flex;align-items: center;
     margin-right: 0.5em;   // Space between icon and text
  }
}
}

/* Tablet - 768px */
@media only screen and (min-width: 48rem) {
  .container{
    grid-template-columns: 1fr 1fr;
    margin: 0 auto;
    gap:8px;

  }
  .cart-items-container{
    grid-row: 1;

    grid-column: 2;
    justify-self: start;
    align-self: start;


  }
  .checkout-card{
    grid-column: 1;
    grid-row: 1;
    justify-self: end;
    align-self: start;

  }
}
// dark mode
body.dark-mode{
  .order-info{
    color: var(--sl-color-neutral-300);


  & strong{
    padding: 0.5em;
    background-color: var(--sl-color-neutral-700);
    color: var(--sl-color-neutral-300);
  }
  &:last-of-type{
    padding-bottom: 1em;
    border-bottom: 1px solid var(--sl-color-neutral-300) ;
  }
}
  .checkout-card::part(base){
    background-color: var(--dark);
    border: none;
    color: var(--sl-color-neutral-300); 

  }
  .help-text{
    color: var(--sl-color-neutral-500); 

  }
  .form-input,
  .form-select,
  .form-textarea {
    background-color: #222222;
    color: var(--sl-color-neutral-300); 

  }
  .checkout-card::part(header) {
    background-color: unset ;
  }

}



</style>