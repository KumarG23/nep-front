import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from './CartContext';
import axiosInstance from './axiosConfig';
import { url } from './api';
import StripeProvider from './StripeProvider';
import CheckoutForm from './CheckoutForm';
import { useNavigate } from 'react-router-dom';

export const CartPage = () => {
    const { cart, setCart, loading } = useContext(CartContext);
    const [totalPrice, setTotalPrice] = useState(0);
    const [email, setEmail] = useState('');
    const [products, setProducts] = useState([]);
    const [clientSecret, setClientSecret] = useState('');
    const navigate = useNavigate();
    
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
                const orderItems = cart.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    name: item.name,
                    price: item.price,
                }));
                const response = await axiosInstance.post(`${url}/create-payment-intent/`, {
                    amount: totalPrice * 100, // amount in cents
                    metadata: {
                        items: JSON.stringify(orderItems),
                    },
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

    const updateQuantity = (itemId, newQuantity) => {
        setCart(cart.map(item =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        ));
    };

    const removeItem = (itemId) => {
        setCart(cart.filter(item => item.id !== itemId));
    };

    const handleCheckout = async (isGuest) => {
        if (isGuest && !email) {
            alert('Please enter an email for guest checkout.');
            return;
        }

        try {
            const endpoint = isGuest ? `${url}/orders/guest/` : `${url}/orders/`;
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
            navigate('/confirmation?payment_intent=' + response.data.payment_intent + '&payment_intent_client_secret=' + response.data.payment_intent_client_secret + '&redirect_status=' + response.data.status);
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        handleCheckout(false);
    }

    if (loading) {
        return <div>Loading...</div>;
    }

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
                            <li key={item.id} className='cart-item'>
                                {product ? (
                                    <>
                                        <div>Product Name: {product.name}</div>
                                        <div>Product Price: ${product.price}</div>
                                        <div>Quantity: {item.quantity}</div>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                        <button onClick={() => removeItem(item.id)}>Remove</button>
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
                    <CheckoutForm handleCheckout={handleCheckout} />
                </StripeProvider>
            )}
        </div>
    );
};

