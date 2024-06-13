import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from './CartContext';
import axiosInstance from './axiosConfig';
import { url } from './api';
import StripeProvider from './StripeProvider';
import { ProductPage } from './ProductPage';
import CheckoutForm from './CheckoutForm';
import axios from 'axios';
import { PaymentElement } from '@stripe/react-stripe-js';

export const CartPage = () => {
    const { cart, setCart, loading, updatedCart } = useContext(CartContext);
    const [totalPrice, setTotalPrice] = useState(0);
    const [email, setEmail] = useState('');
    const [products, setProducts] = useState([]);
    const [clientSecret, setClientSecret] = useState('');
    
    

    useEffect(() => {
        const calculateTotalPrice = () => {
            if (!cart || cart.length === 0) {
                setTotalPrice(0);
                return;
            }

            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            setTotalPrice(total);
        };

        if (!loading) {
            calculateTotalPrice();
        }
    }, [cart, loading]);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const productIds = cart.map(item => item.id);
                if (productIds.length > 0) {
                    const response = await axiosInstance.get(`/products/?ids=${productIds.join(',')}`);
                    setProducts(response.data);
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        if (!loading && cart.length > 0) {
            fetchProductDetails();
        }
    }, [cart, loading]);


    useEffect(() => {
        const createPaymentIntent = async () => {
          try {
            const response = await axiosInstance.post(`${url}/create-payment-intent/`, {
              amount: totalPrice * 100, // amount in cents
            });
            setClientSecret(response.data.clientSecret);
          } catch (error) {
            console.error('Error creating payment intent:', error);
          }
        };
    
        if (totalPrice > 0) {
          createPaymentIntent();
        }
      }, [totalPrice]);

    const updateQuantity = async (itemId, newQuantity) => {
        try {
            const response = await axios.put(`${url}/cart/${itemId}/`, { quantity: newQuantity });
            setCart(cart.map(item =>
                item.id === itemId ? { ...item, quantity: response.data.quantity } : item
            ));
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    // const removeItem = async (itemId) => {
    //     try {
    //         await axiosInstance.delete(`${url}/cart/${itemId}/`);
    //         setCart(cart.filter(item => item.id !== itemId));
    //     } catch (error) {
    //         console.error('Error removing item:', error);
    //     }
    // };

    const handleCheckout = async (isGuest) => {
        if (isGuest && !email) {
            alert('Please enter an email for guest checkout.');
            return;
        }

        try {
            const endpoint = isGuest ? '/orders/guest/' : '/orders/';
            const requestData = {
                cart: cart.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    name: item.name,
                    price: item.price,
                })),
                total_price: totalPrice,
            };

            if (isGuest) {
                requestData.email = email;
            }

            const headers = isGuest ? {} : {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            };

            const response = await axiosInstance.post(endpoint, requestData, { headers });
            // Handle successful checkout (e.g., redirect to order confirmation page)
            console.log('Order placed successfully', response.data);
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const deleteCartItem = async (cartProductId) => {
        try {
          const response = await axiosInstance.delete(`${url}/cart/${cartProductId}/delete`);
          console.log('Item Id: ', cartProductId);
          console.log('Delete Item: ', response);
          setCart(cart.filter(item => item.id !== cart))
        } catch (error) {
          console.error('Error deleting item: ', error);
          throw error;
        }
      };
      

    return (
        <div>
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cart.map(item => {
                        const product = products.find(p => p.id === item.id);
                        return (
                            <li key={item.id}>
                                {product ? (
                                    <>
                                        <div>Product Name: {product.name}</div>
                                        <div>Product Price: ${product.price}</div>
                                        <div>Quantity: {item.quantity}</div>
                                        {/* <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button> */}
                                        <button onClick={() => deleteCartItem(product.id)}>Remove</button>
                                    </>
                                ) : (
                                    <div>Loading product details...</div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            {clientSecret && (
        <StripeProvider clientSecret={clientSecret}>
          <form>
            <PaymentElement />
            <button type="submit">Submit</button>
          </form>
        </StripeProvider>
      )}
      </div>
    );
};

