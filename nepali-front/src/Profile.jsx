import React, { useEffect, useState } from 'react';
import { getUser, getUserOrders } from './api';

export const Profile = () => {
  const [firstName, setFirstName] = useState('');
  const [orders, setOrders] = useState([]);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (accessToken) {
      handleGetUser();
      handleGetUserOrders();
    }
  }, [accessToken]);

  const handleGetUser = async () => {
    try {
      const userData = await getUser({ auth: { accessToken } });
      console.log('User Data: ', userData);
      setFirstName(userData.first_name);
    } catch (error) {
      console.error('Error getting user: ', error);
    }
  };

  const handleGetUserOrders = async () => {
    try {
      const userOrders = await getUserOrders({ auth: { accessToken } });
      console.log('User order Data: ', userOrders);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error getting user Orders: ', error);
    }
  };

  console.log('First name: ', firstName);
  console.log('orders: ', orders);

  return (
    <div>
      <h1>{firstName}'s Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <h2>Order ID: {order.id}</h2>
            <p>Total Price: {order.total_price}</p>
            <p>Created At: {order.created_at}</p>
            {/* <p>Payment Intent ID: {order.payment_intent_id}</p> */}
            <h3>Order Items:</h3>
            <ul>
              {order.order_items.map((item) => (
                <li key={item.id}>
                  <p>Product Name: {item.product.name}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: {item.price}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

