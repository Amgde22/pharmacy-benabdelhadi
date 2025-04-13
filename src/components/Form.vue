<template>

<form  
    data-netlify="true"
    name="html form - no ajax"
    method="post"   >
<!-- hidden input -->
<input type="hidden" name="form-name" value="html form - no ajax" />
    <input type="text" name="username" id="username" value="html form - no ajax">
    <br>
    <input type="number" name="quantity" id="quantity" value="3">
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
      <button type="submit">Send</button>
</form>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>