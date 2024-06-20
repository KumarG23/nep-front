import React, { useEffect, useState } from 'react';
import { useStripe, useElements, PaymentElement, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import { Box, Button } from '@chakra-ui/react';

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canMakePayment, setCanMakePayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Total',
          amount: amount * 100, // amount in cents
        },
        requestPayerName: true,
        requestPayerEmail: true,
        // Enable card payment method
        requestPaymentMethod: ['card']
      });

      pr.canMakePayment().then((result) => {
        if (result) {
          console.log("PaymentRequest can make payment:", result);
          setPaymentRequest(pr);
          setCanMakePayment(true);
        } else {
          console.log("PaymentRequest cannot make payment");
        }
      }).catch((error) => {
        console.error("Error checking canMakePayment:", error);
      });
    }
  }, [stripe, amount]);

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/confirmation',
      },
    });

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
      console.error("Payment error:", error);
    }
  };

  return (
    <div>
      {canMakePayment && paymentRequest && (
        <PaymentRequestButtonElement options={{ paymentRequest }} />
      )}
      <form>
        <PaymentElement />
        <Box mt={4} mb={4}>
          <Button onClick={handleSubmit} disabled={!stripe}>
            Pay Now
          </Button>
        </Box>
        {errorMessage && <div>{errorMessage}</div>}
      </form>
    </div>
  );
};

export default CheckoutForm;


