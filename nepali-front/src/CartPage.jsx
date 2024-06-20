import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import axiosInstance from "./axiosConfig";
import { url, getUser } from "./api";
import StripeProvider from "./StripeProvider";
import CheckoutForm from "./CheckoutForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export const CartPage = () => {
  const { cart, setCart, loading, totalPrice } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [clientSecret, setClientSecret] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (accessToken) {
          const userData = await getUser({ auth: { accessToken } });
          setEmail(userData.email); // Set the email from fetched user data
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [accessToken]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productIds = cart.map((item) => item.id);
        if (productIds.length > 0) {
          const response = await axiosInstance.get(
            `/products/?ids=${productIds.join(",")}`
          );
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    if (!loading && cart.length > 0) {
      fetchProductDetails();
    }
  }, [cart, loading]);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await axios({
          method: "post",
          url: `${url}/create-payment-intent/`,
          data: {
            amount: totalPrice * 100, // amount in cents
          },
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        console.log("Create Payment Intent Response: ", response.data);
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
      }
    };

    if (totalPrice > 0 && accessToken) {
      createPaymentIntent();
    }
  }, [totalPrice, accessToken]);

  const updateQuantity = (itemId, newQuantity) => {
    setCart(
      cart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

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
          {cart.map((item) => {
            const product = products.find((p) => p.id === item.id);
            return (
              <li key={item.id} className="cart-item">
                {product ? (
                  <>
                    <div>Product Name: {product.name}</div>
                    <div>Product Price: ${product.price}</div>
                    <div>Quantity: {item.quantity}</div>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
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
          <CheckoutForm amount={totalPrice} />
        </StripeProvider>
      )}
    </div>
  );
};

