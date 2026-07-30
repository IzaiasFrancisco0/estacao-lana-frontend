import { useState, useEffect } from "react";
import { getProducts, saveProducts } from "../storage/storage";

export function useInventory() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        setProducts(getProducts());
    }, []);

    const updateProduct = (updatedProductList) => {
        saveProducts(updatedProductList);
        setProducts(updatedProductList);
    };

    const addMovement = (movement) => {
        const history = JSON.parse(localStorage.getItem("movements")) || [];
        history.push({
            ...movement,
            id: Date.now(),
            date: new Date().toLocaleDateString("pt-BR"),
            hour: new Date().toLocaleTimeString("pt-BR"),
        });
        localStorage.setItem("movements", JSON.stringify(history));
    };

    return { products, updateProduct, addMovement };
}