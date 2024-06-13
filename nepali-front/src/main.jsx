import React, { createContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from './theme.js';
import axios from 'axios';
import getCookie from './getCookie.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'semantic-ui-css/semantic.min.css'
import { ChakraProvider } from '@chakra-ui/react'

import App from './App.jsx'
import './index.css'
import SignUp from './SignUp.jsx';
import Login from './Login.jsx';
import { Profile } from './Profile.jsx';
import { ProductPage } from './ProductPage.jsx';
import { CartPage } from './CartPage.jsx';
import { AuthContext } from './AuthContext.js';
import { CartContext } from './CartContext.jsx';
import Header from './Header.jsx';
import { Footer } from './Footer.jsx';
import ErrorPage from './ErrorPage.jsx';
import { ProductDetails } from './ProductDetails.jsx';
import CheckoutPage from './CheckoutPage.jsx';
import CartProvider from './CartContext.jsx';


function Layout() {
  return (
    <>
      <Header />
      <div id='page-content'>
        <Outlet />
      </div>
      <Footer />
      <ToastContainer />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <App />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <SignUp />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/cart',
        element: <CartPage />,
      },
      {
        path: '/product',
        element: <ProductPage />
      },
      {
      path: 'product-details',
      element: <ProductDetails />
      },
      {
        path: 'checkout',
        element: <CheckoutPage />
      }
    ],
  },
]);

const AuthContextProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || (''));

  const auth = {
    accessToken,
    setAccessToken,
  }

  return(
    <AuthContext.Provider value={{ auth: auth }} >
      {children}
    </AuthContext.Provider>
  )
}


ReactDOM.createRoot(document.getElementById('root')).render(
<AuthContextProvider>
  <CartProvider>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </CartProvider>
</AuthContextProvider>
  
)
