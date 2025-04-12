import { atom } from 'nanostores'

export const Cart = atom({
    products:["a","b"]
})

export function addItemToCart(item) {
    Cart.set(
        {
            products:["x","x","x"]
        }
        
    )
}