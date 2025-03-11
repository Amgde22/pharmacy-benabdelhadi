<template>
    <div class="container">
        <button
         class="item"
         :class="{selected:selectedItem == '' }"
         @click="selectItem('')"
         >
            {{ selectAllLabel }}
        </button>

        <button
        v-for="item in items"
         class="item"
         :class="{selected:selectedItem == item }"

         @click="selectItem(item)"
         >
            {{ item }}
        </button>
    </div>
</template>

<script setup>
import {ref} from "vue"
const emit = defineEmits(["select"])
const props = defineProps({
    items:Array,
    selectAllLabel:{
        type:String,
        default:"All"
    }
})

const selectedItem = ref("")
function selectItem(item) {

    selectedItem.value = item
    emit("select",item)
}
</script>

<style lang="less" scoped>
.container{
    width: 100%;
    overflow-x: scroll;
    margin: 0;
    margin-top: 16px;
    padding-bottom: 20px;
    display: flex;
    gap: 8px;

    padding-left: 16px;
    padding-left: min(5vw,32px);

        /* Hide default scrollbar for WebKit browsers */
        &::-webkit-scrollbar {
        height: 16px; /* Short height for the scrollbar */
    }
    
    /* Track styling */
    &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 20px;
    }
    
    /* Handle styling - pill shape */
    &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        transition: background 0.3s ease;
    }
    
    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.3);
    }
    
    /* Firefox scrollbar styling */
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.05);

    & .item{
        flex:0 0 auto;
    }
}

.item{
    --color : var(--primary) ;
    --border-color:rgb(170, 170, 170);
    box-sizing: border-box;
    border: none;
    font-size: 1.1em;
    text-transform: capitalize;
    padding: 0.2em 1.25em;
    border-radius: 100vw;

    background-color: white;
    color: black;

    &:not(.selected){
        border: 1px solid var(--border-color);

    }

    &.selected{

    background-color: var(--color);
    color: white;
    }
}
/* ==========================================================================
   Dark Mode Styles (body.dark-mode)
   ========================================================================== */

   @media only screen and (min-width: 0rem) {
        body.dark-mode {

        .container{
                /* Track styling */
    &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.15);

    }
    
    /* Handle styling - pill shape */
    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.4);

    }
    
    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.4);
    }
        /* Firefox scrollbar styling */
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.15);
        }
        .item{
            --color : var(--medium) ;
            --border-color:rgb(114, 114, 114);

        }
    }
}

</style>