import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { url } from './api';

const ConfirmationPage = () => {
    const location = useLocation();
    const [paymentIntentId, setPaymentIntentId] = useState(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setPaymentIntentId(queryParams.get('payment_intent'));
        setStatus(queryParams.get('redirect_status'));
    }, [location.search]);

    useEffect(() => {
        const confirmOrder = async () => {
            if (status === 'succeeded' && paymentIntentId) {
                try {
                    console.log('Sending confirmation request with:', {
                        payment_intent_id: paymentIntentId,
                    });

                    const response = await axios.post(`${url}/orders/confirm/`, {
                        payment_intent_id: paymentIntentId,
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    console.log('Order confirmed:', response.data);
                } catch (error) {
                    console.error('Error confirming order:', error.response ? error.response.data : error.message);
                }
            }
        };

        confirmOrder();
    }, [paymentIntentId, status]);

    return (
        <div>
            <h2>Order Confirmation</h2>
            {status === 'succeeded' ? (
                <div>
                    <p>Thank you for your purchase!</p>
                    <p>Payment Intent ID: {paymentIntentId}</p>
                    <p>Your payment was successful.</p>
                </div>
            ) : (
                <div>
                    <p>There was an issue with your payment.</p>
                    <p>Please try again or contact support.</p>
                </div>
            )}
        </div>
    );
};

export default ConfirmationPage;



