import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { stripePromise } from './StripeProvider';
import { url } from './api';

const ConfirmationPage = ({ cart, totalPrice, loading }) => {
    const location = useLocation();
    const [paymentIntentId, setPaymentIntentId] = useState(null);
    const [status, setStatus] = useState(null);
    const [ messageBody, setMessageBody] = useState('');
    const [shippingAddress, setShippingAddress] = useState(null);


    useEffect(() => {
        if (!stripePromise) return;

        stripePromise.then(async (stripe) => {
            const baseurl = new URL(window.location);
            const clientSecret = baseurl.searchParams.get('payment_intent_client_secret');
            const { error, paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

            if (error) {
                console.error('error: ', error)
            }

            else if (paymentIntent) {
                console.log('payment: ', paymentIntent);
                setPaymentIntentId(paymentIntent.id);
                setStatus(paymentIntent.status);

                if (paymentIntent.status === 'succeeded') {
                    handleCheckout();
                }
            }
        })
    }, [stripePromise, location.search])

    const calculateTotalPrice = (cartData) => {
        return cartData.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    };

    const handleCheckout = async () => {
        console.log("BLAMMO: HERE>>>>>>>>>>>>>>>>>>>>>>>>");
        
        try {
            const cartData = JSON.parse(localStorage.getItem('cart'));
            const shippingAddress = JSON.parse(localStorage.getItem('shipping_address'));
            const totalPrice = calculateTotalPrice(cartData); // Ensure this function calculates correctly
            console.log('cart data: ', cartData);
            console.log('total price: ', totalPrice);
            const endpoint = `${url}/orders/`;
            const requestData = {
                products: cartData.map((product) => ({
                    product_id: product.id,
                    quantity: product.quantity,
                    name: product.name,
                    price: product.price,
                })),
                total_price: totalPrice,
                payment_intent_id: paymentIntentId,
                shipping_address: shippingAddress,
            };
            console.log("request data: ", requestData);
    
            const response = await axios({
                method: "post",
                url: endpoint,
                data: requestData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            console.log('order placed successfully', response.data);

            localStorage.removeItem('cart');
            
        } catch (error) {
            console.error('error placing order', error);
        }
    };
          
    
        //   if (isGuest) {
        //     requestData.email = email;
        //   }
    
        //   const headers = isGuest
        //     ? {}
        //     : {
        //         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        //       };
    
        
    //       const response = await axios({
    //         method: "post",
    //         url: endpoint,
    //         data: requestData,
    //       });
    //       // Handle successful checkout (e.g., redirect to order confirmation page)
    //       console.log("Order placed successfully", response.data);
    //         navigate(
    //           "/confirmation?payment_intent=" +
    //             response.data.payment_intent +
    //             "&payment_intent_client_secret=" +
    //             response.data.payment_intent_client_secret +
    //             "&redirect_status=" +
    //             response.data.status
    //         );
    //     } catch (error) {
    //       console.error("Error placing order:", error);
    //     }
    //   };
    
      const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("BLAMMO: CART PAGE: HANDLE SUBMIT");
        handleCheckout(false);
      };
    

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




