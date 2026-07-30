import { INITIAL_PRODUCTS } from "../data/products";

export function getProducts(){
 const products =
 localStorage.getItem("products");

 if(products){
   return JSON.parse(products);
 }

 localStorage.setItem(
   "products",
   JSON.stringify(INITIAL_PRODUCTS)
 );

 return INITIAL_PRODUCTS;
}

export function saveProducts(products){
 localStorage.setItem(
   "products",
   JSON.stringify(products)
 );

}