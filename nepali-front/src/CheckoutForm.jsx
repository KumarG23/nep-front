
import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ handleCheckout }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/confirmation',
      },
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      // Custom redirect after payment
      await handleCheckout(paymentIntent);
      navigate(`/confirmation?payment_intent=${paymentIntent.id}&payment_intent_client_secret=${paymentIntent.client_secret}&redirect_status=${paymentIntent.status}`);
    }
  };

  return (
    <form id='pay' onSubmit={handleSubmit}>
      <PaymentElement />
      <button id='pay' type="submit" disabled={!stripe}>Submit</button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

export default CheckoutForm;
