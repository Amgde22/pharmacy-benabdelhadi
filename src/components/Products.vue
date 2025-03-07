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
            :product="product"
            :product-images="productImages[product.id]"
        />
        
    </section>
</template>

<script setup>
    import ProductCard from "@components/ProductCard.vue"



    const props = defineProps({
        isSection:{
            type:Boolean,
            default:true
        },
        products:{
            type:Array,
            required:true
        },
        productImages:{
            type:Object
        }
    })




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
        overflow-y: hidden;
    }

    // grid
    display: grid;
    gap: 16px;
justify-items: center;
align-items: start;
    grid-template-columns: repeat( auto-fit, minmax(250px, 1fr));
}



</style>