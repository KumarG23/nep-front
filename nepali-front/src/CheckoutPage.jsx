import React, { useState, useContext } from 'react';
import axios from 'axios';
import { CartContext } from './CartContext';

const CheckoutPage = () => {
    const { cart } = useContext(CartContext);
    const [email, setEmail] = useState('');

    const handleCheckout = async () => {
        try {
            const response = await axios.post('/checkout/', {
                email,
                cart_id: cart.id
            }, {
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')  // Include CSRF token if needed
                }
            });
            console.log(response.data.message);
            // Redirect to order confirmation page or show success message
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    return (
        <div>
            <h2>Checkout</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
            />
            <button onClick={handleCheckout}>Checkout as Guest</button>
        </div>
    );
};

export default CheckoutPage;
