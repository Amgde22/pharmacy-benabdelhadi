<template>
        <h1 class="title">title</h1>

    <section :class="[
        'product-section',
        {
            isSection:isSection == true
        }
        ]">

        <ProductCard v-for="product in products"
            :key="product.id"
            :id="product.id"
            :name="product.name"
            :description="product.description"
            :price="product.price"
            :imageUrl="placeHolderImage.src"
            :offer="product.offer"
        />
        
    </section>
</template>

<script setup>
    import {products} from "@data/products.json"
    import ProductCard from "@components/ProductCard.vue"
    import placeHolderImage from "@assets/images/nature.jpeg"


    const {isSection} = defineProps()


</script>

<style lang="less" scoped>
.product-section{
    border: 2px solid violet;
    // sizing
    padding: 16px 20px;
// if isSection prop is true , product section will be small
    min-height:90vh ;
    &.isSection{
        height: 500px;
    }

    // grid
    display: grid;
    gap: 16px;
justify-items: center;
align-items: start;
    grid-template-columns: repeat( auto-fit, minmax(250px, 1fr));
}



</style>