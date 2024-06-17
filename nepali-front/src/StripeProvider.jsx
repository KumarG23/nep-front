import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

export const stripePromise = loadStripe(
  "pk_test_51PRDH1KTI3hDF0HSe111z5ReZsTeRySAzZ1I4v9mGLZalGYVLYtnfZ2RV5n48fnPVq6nQyWy6UIlS8cFGnqxS0Uu002RZyNh0P"
);

const StripeProvider = ({ children, clientSecret }) => {
  const options = {
    clientSecret,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
