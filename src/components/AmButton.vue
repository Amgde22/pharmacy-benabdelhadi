<template>
 <a
 :href="href" :target="href?'_blank':''"
class="custom-button"
 :class="[classes, { collapse: collapse }]"
 :style="{ fontSize: fontSize }"
>
<slot name="icon-start"></slot>
<div class="text">
  <slot ></slot>
</div>
<slot name="icon-end"></slot>
</a>
</template>

<script setup>
import { defineProps, computed } from 'vue';
const props = defineProps({
fontSize: {
type: String,
default: '1rem'
 },
classes: {
type: String,
default: ''
 },
collapse: {
type: Boolean,
default: false
 },
href:{
type:String,
default:""  // Fixed: should be lowercase 'default'
 }
});
</script>

<style scoped lang="less">
.custom-button {
--text-color: black;
--background-color: var(--primaryLight);
--icon-color: white;
background-color: var(--background-color);
color: var(--text-color);
width: max-content;
font-size: 1rem;
padding: 0.45em 1.5em;
border: none;
border-radius: 20px;
cursor: pointer;
position: relative;
overflow: hidden;
display: inline-flex;
align-items: center;
justify-content: center;
isolation: isolate;
gap: 0.25em;

&::before {
content: '';
position: absolute;
inset: 0;
margin: auto;
transform: scale(0);
width: 2em;
height: 2em;
border-radius: 50%;
background-color: rgb(38, 38, 38);
transform-origin: center;
transition: all 250ms ease-in-out;
z-index: -1;
 }

&:hover::before {
transform: scale(6);
 }

&:hover {
--text-color: white;
color: var(--text-color);
 }

 :deep(::slotted([slot="icon-start"])) ,
 :deep(::slotted([slot="icon-end"])) {
fill: var(--icon-color);
width: 1em;
height: 1em;
z-index: 1;
 }

svg {
z-index: 1;
 }
}

// Hide text slot under 420px screens
@media only screen and (max-width: 420px) {
.custom-button {
  box-sizing: border-box;
  padding: 10px;
  border-radius: 100%;
  margin-inline-start: 20px;
 .text{display: none;}


}
}

// mobile styles

// dark mode
@media only screen and (min-width: 0rem) {
body.dark-mode {
.custom-button {
--background-color: var(--medium);
--text-color: white;
 }
 }
}
</style>