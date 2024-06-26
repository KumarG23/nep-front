import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from './axiosConfig';
// import getCookie from './getCookie';
import axios from 'axios';
// import { baseURL } from './axiosConfig';
import { url } from './api';
import { toast } from 'react-toastify';

export const CartContext = createContext();


export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [loading, setLoading] = useState(true);
    const [totalPrice, setTotalPrice] = useState(0);

        const calculateTotalPrice = (cartItems) => {
            const total = cartItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            )
            setTotalPrice(total);
        }



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
                calculateTotalPrice(formattedCart);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cart:', error);
                setLoading(false);
            }
        };
        const savedCart = localStorage.getItem('cart');
        if (!savedCart) {
            fetchCart();
        } else {
            const parsedCart = JSON.parse(savedCart);
            setCart(parsedCart);
            calculateTotalPrice(parsedCart);
            setLoading(false);
        }
    }, []);


    

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
        calculateTotalPrice(cart);
    }, [cart]);

 

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
            toast.error('Error adding item to cart');
        }
    };

    return (
        <CartContext.Provider value={{ cart, setCart, loading, addToCart, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;




