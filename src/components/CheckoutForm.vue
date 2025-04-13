<template >
  <!-- Wrap the form in an sl-card for better presentation -->
  <sl-card 
  class="form-card"
  :class="{'hidden':hidden}"
  >
    <div slot="header">
      My Awesome Form
    </div>

    <!-- Keep the standard form tag for submission handling -->
    <form

      ref="form"
      data-netlify="true"
      name="shoelace-vue-form"
      @submit.prevent="handleSubmit"
      method="post"
      class="form-content"
    >
      <!-- Netlify hidden input -->
      <input type="hidden" name="form-name" value="shoelace-vue-form" />

      <!-- Shoelace Input for Username -->
      <sl-input
        label="Username"
        name="username"
        id="username"
        value="vue form - shoelace"
        help-text="Enter your desired username"
        class="form-control"
        clearable
      ></sl-input>

      <!-- Shoelace Input for Validation (Consider if this field is really needed) -->
      <!-- If it's just for testing, maybe hide it or make it readonly -->
       <sl-input
        label="Validation Info"
        name="valid"
        id="valid"
        value="Shoelace form looks good!"
        help-text="Internal info field"
        class="form-control"
        readonly
      ></sl-input>

      <!-- Shoelace Input for Quantity -->
       <sl-input
        type="number"
        label="Quantity"
        name="quantity"
        id="quantity"
        value="4"
        min="0"
        max="100"
        step="1"
        help-text="How many items?"
        class="form-control"
      ></sl-input>

      <!-- Shoelace Select for Pets -->
      <sl-select
        label="Select Your Pet"
        name="pets"
        id="pet-select"
        value="dog"  
        help-text="Choose your favorite companion"
        class="form-control"
        clearable
      >
        <!-- Note: Use value attribute on sl-select for default -->
        <sl-option value="dog">Dog</sl-option>
        <sl-option value="cat">Cat</sl-option>
        <sl-option value="hamster">Hamster</sl-option>
        <sl-option value="parrot">Parrot</sl-option>
        <sl-option value="spider">Spider</sl-option>
        <sl-option value="goldfish">Goldfish</sl-option>
      </sl-select>

      <!-- Shoelace Select for Ice Cream -->
      <sl-select
        label="Favorite Ice Cream"
        name="favorite_ice_cream" 
        id="ice-cream-select" 
        value="strawberry" 
        help-text="Pick the tastiest flavor!"
        class="form-control"
        clearable
       >
        <!-- Note: Use unique name/id if different from pets -->
        <sl-option value="strawberry">Strawberry</sl-option>
        <sl-option value="vanilla">Vanilla</sl-option>
        <sl-option value="choco">Chocolate</sl-option>
        <sl-option value="coco">Coconut</sl-option> 
        <sl-option value="peanut_butter">Peanut Butter</sl-option> 
      </sl-select>

      <!-- Shoelace Button for Submission -->
      <sl-button
         type="submit"
         variant="primary"
         class="submit-button"
      >
        <sl-icon slot="prefix" name="send"></sl-icon>
        Send Information
      </sl-button>

    </form>
  </sl-card>
</template>

<script setup>
import { ref } from "vue";

// --- Shoelace Component Imports ---
// Import necessary components. Ensure Shoelace is installed
// and base path/styles are set up (usually in main.js/ts).
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js'; // For button icon

const props = defineProps({
  hidden:{type:Boolean,default:false}
})
// --- Form Logic ---
const form = ref(null);

const handleSubmit = async () => {
  if (!form.value) return; // Guard clause

  const formData = new FormData(form.value);

  // Log FormData contents for debugging
  console.log("FormData Entries:");
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
  console.log("URL Encoded:", new URLSearchParams(formData).toString());

  // --- Netlify Submission Logic (or your backend) ---
  try {
    const response = await fetch("/", { // Or your specific API endpoint
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString()
    });

    if (response.ok) {
        alert('Shoelace form submitted successfully!');
        // Optionally reset the form: form.value.reset();
        // Or reset Shoelace components individually if needed
    } else {
        // Handle server errors (e.g., response.status !== 200)
        alert(`Form submission failed: Server responded with status ${response.status}`);
    }
  } catch (error) {
    // Handle network errors or other exceptions
    console.error("Form submission error:", error);
    alert('Form submission failed: ' + error.message);
  }
};
</script>

<style lang="less" scoped>
.hidden{
  display: none;
}
/* Add some basic styling for layout */
.form-card {
  max-width: 600px; /* Constrain width */
  margin: 2rem auto; /* Center the card */
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* Spacing between form controls */
}

/* Ensure labels and help text look good */
.form-control::part(form-control-label) {
  margin-bottom: 0.25rem; /* Space below label */
}

.form-control::part(form-control-help-text) {
  margin-top: 0.25rem; /* Space above help text */
}

.submit-button {
  margin-top: 1rem; /* Add some space above the submit button */
  align-self: flex-start; /* Align button to the left */
}

/* Optional: If you need finer control */
// sl-input, sl-select {
//   width: 100%; // Make inputs take full width if needed
// }
</style>