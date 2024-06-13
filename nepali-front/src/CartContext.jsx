import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from './axiosConfig';
// import getCookie from './getCookie';
import axios from 'axios';
// import { baseURL } from './axiosConfig';
import { url } from './api';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(localStorage.getItem('cart') || ([]));
    const [loading, setLoading] = useState(true);
    // const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || (''));
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get(`${url}/cart/`);
                const formattedCart = response.data.cart.map(item => ({
                    id: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity
                }));
                setCart(formattedCart);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cart:', error);
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const addToCart = async (productId, productName, productPrice, quantity = 1) => {
        try {
            const formData = new FormData();
            formData.append('product_id', productId);
            formData.append('quantity', quantity);
            formData.append('name', productName);
            formData.append('price', productPrice);

            const response = await axios.post(`${url}/cart/add/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const newItem = {
                id: response.data.product.id,
                name: response.data.product.name,
                price: response.data.product.price,
                quantity: response.data.product.quantity
            };

            setCart(prevCart => {
                const existingItemIndex = prevCart.findIndex(item => item.id === productId);
                if (existingItemIndex !== -1) {
                    const updatedCart = [...prevCart];
                    updatedCart[existingItemIndex].quantity += quantity;
                    return updatedCart;
                } else {
                    return [...prevCart, newItem];
                }
            });
            toast.success('Item added to cart successfully')
            console.log('Item added to cart successfully', response.data);
        } catch (error) {
            console.error('Error adding to cart:', error);
            // Implement error handling as needed
        }
    };

    return (
        <CartContext.Provider value={{ cart, setCart, loading, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;




