<template>
        <h1 class="title">Nos Produits :</h1>

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
import {computed} from "vue"


    const props = defineProps({
        isSection:{
            type:Boolean,
            default:false
        },
        products:{
            type:Array,
            required:true
        },
        productImages:{
            type:Object
        }
    })


    const displayedProduct = computed(()=>{
        // if not a section then display ALL products
        const products = props.products
        
        if (props.isSection == false) return products

        const breakPoint = 800
        const screenWidth = window ? window.innerWidth : breakPoint

        // display the first 3 on mobile
        if (screenWidth <= breakPoint) {
            return products.slice(0, 3);
        }
        else{
            // display the first 6 on pc
            return products.slice(0, 6);
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
    // &.isSection{
    //     height: 500px;
    //     overflow-y: hidden;
    // }

    // grid
    display: grid;
    gap: 16px;
justify-items: center;
align-items: start;
    grid-template-columns: repeat( auto-fit, minmax(250px, 1fr));
}



</style>