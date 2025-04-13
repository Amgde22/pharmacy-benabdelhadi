<template>

    <form  
        ref="form"
        data-netlify="true"
        name="html form - with ajax"
        @submit.prevent="handleSubmit"
        method="post"   >
    <!-- hidden input -->
    <input type="hidden" name="form-name" value="html form - with ajax" />
        <input type="text" name="username" id="username" value="vue form - with ajax - no skeleton">
        <br>
        <input type="text" name="username" id="username" value="if you see this then no form needs to be scaned">
    <br>
        <input type="number" name="quantity" id="quantity" value="4">
        <br>
        <select name="pets" id="pet-select">
            <option value="">--Please choose an option--</option>
            <option value="dog" selected>Dog</option>
            <option value="cat">Cat</option>
            <option value="hamster">Hamster</option>
            <option value="parrot">Parrot</option>
            <option value="spider">Spider</option>
            <option value="goldfish">Goldfish</option>
          </select>

          <select name="favorite ice cream" id="pet-select">
        <option value="">--Please choose an option--</option>
        <option value="strawberry" selected>strawberry</option>
        <option value="vanilla">vanilla</option>
        <option value="choco">choco</option>
        <option value="coco">coco</option>
        <option value="peanut buder">peanut buder</option>
        <option value="goldfish">Goldfish</option>
      </select>


          <button type="submit">Send</button>
    </form>
    </template>
    
    <script setup>
import {ref} from "vue"
    const form = ref(null)
    const handleSubmit = async () => {
      const formData = new FormData(form.value);

    console.log({
        formData,
    urlCoded:new URLSearchParams(formData).toString()
});
    
      try {
        await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString()
        })
        alert('vue Form submitted successfully!');
      } catch (error) {
        alert('Form submission failed: ' + error.message);
      }
    };
    </script>
    
    
    <style lang="scss" scoped>
    
    </style>