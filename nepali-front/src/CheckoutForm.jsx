import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "./api";
import { Box, Button } from "@chakra-ui/react";

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  console.log("CHECKOUT FORM: ");

  const handleSubmit = async () => {
    console.log("BLAMMO: HANDLE SUBMIT");

    if (!stripe || !elements) {
      return
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/confirmation",
      },
    })

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setErrorMessage(error.message);
    } else {
      setErrorMessage('An unexpected error occurred.')
    }

  };

  return (
    <div>
      <AddressElement 
      options={{mode: 'shipping' }}/>
      <PaymentElement />
      <Box mt={4} mb={4}>
        <Button onClick={() => handleSubmit()} disabled={!stripe}>
          Pay Now
        </Button>
      </Box>
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
};

export default CheckoutForm;
