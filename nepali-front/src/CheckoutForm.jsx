// CheckoutForm.jsx
import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "./api";

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
      }
    })

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setErrorMessage(error.message);
    } else {
      setErrorMessage('An unexpected error occurred.')
    }

    // const {error: submitError} = await elements.submit()
    // if (submitError) {
    //   console.log('OH NO!  A ELEMENTAL ERROR!: ', submitError)
    //   return
    // }

    // const { error, confirmationToken } = await stripe.createConfirmationToken({
    //   elements,
    //   params: {
    //   }
    // })

    // if (error) {
    //   console.log('OH NO!  AN ERROR!: ', error)
    //   return
    // }

    // const response = await axios({
    //   method: 'post',
    //   url: `${url}/create-confirm-intent/`,
    //   data: {
    //     amount: amount,
    //     confirmation_token_id: confirmationToken.id
    //   }
    // })

    // console.log('CREATE CONFIRM INTENT: RESPONSE: ', response)

    // if (!stripe || !elements) {
    //   return;
    // }

    // const { error, paymentIntent } = await stripe.confirmPayment({
    //   elements,
    //   // redirect_on_completion: 'if_required',
    //   confirmParams: {
    //     // onComplete: (info) => onCompletion(info),
    //     return_url: window.location.origin + "/confirmation",
    //   },
    // });

    // if (error) {
    //   setErrorMessage(error.message);
    // } else {
    //   console.log("BLAMMO: CHECKOUT FORM");
    //   // Custom redirect after payment
    //   handleCheckout(paymentIntent);
    //   // navigate(
    //   //   `/confirmation?payment_intent=${paymentIntent.id}&payment_intent_client_secret=${paymentIntent.client_secret}&redirect_status=${paymentIntent.status}`
    //   // );
    // }
  };

  return (
    <div>
      <PaymentElement />
      <button onClick={() => handleSubmit()} disabled={!stripe}>
        Submit
      </button>
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
};

export default CheckoutForm;
