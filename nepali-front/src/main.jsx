import React, { createContext, useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
  Navigate
} from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import theme from "./theme.js";
import { getUser } from "./api.js";

import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";
import { ChakraProvider } from "@chakra-ui/react";

import App from "./App.jsx";
import "./index.css";
import SignUp from "./SignUp.jsx";
import Login from "./Login.jsx";
import { Profile } from "./Profile.jsx";
import { ProductPage } from "./ProductPage.jsx";
import { CartPage } from "./CartPage.jsx";
import { AuthContext } from "./AuthContext.js";
import { CartContext } from "./CartContext.jsx";
import Header from "./Header.jsx";
import { Footer } from "./Footer.jsx";
import ErrorPage from "./ErrorPage.jsx";
import { ProductDetails } from "./ProductDetails.jsx";
import CheckoutPage from "./CheckoutPage.jsx";
import CartProvider from "./CartContext.jsx";
import OrderConfirmation from "./ConfirmationPage.jsx";
import ConfirmationPage from "./ConfirmationPage.jsx";
import { AdminPage } from "./AdminPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";





function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  return (
    <>
      <Header />
      <div id="page-content" className={isHomePage ? "homepage" : ""}>
        <div className={isHomePage ? "homepage-content" : ""}>
          {isHomePage && (
            <div className="homepage-text">
              <h1 className="homepage-title">Welcome to Nepali Threads</h1>
              <p className="homepage-subtitle">
                Explore our unique collection of Nepalese clothing.
              </p>
            </div>
          )}
          <Outlet />
        </div>
      </div>
      <Footer />
      <ToastContainer 
      position="top-left"
      closeOnClick
      transition={Bounce}/>
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/profile",
        element: <ProtectedRoute component={<Profile />} />,
      },
      {
        path: "/cart",
        element: <ProtectedRoute component={<CartPage />} />,
      },
      {
        path: "/product",
        element: <ProductPage />,
      },
      {
        path: "/product/:id",
        element: <ProductDetails />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "/confirmation",
        element: <ConfirmationPage />,
      },
      {
        path: "/admin",
        element: <ProtectedRoute component={<AdminPage />} />
      },
    ],
  },
]);

const AuthContextProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || ""
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (accessToken) {
        try {
          const userData = await getUser({ auth: { accessToken } });
          setUser(userData.user);
          console.log("Fetched user data:", userData.user);
        } catch (error) {
          console.error("Failed to fetch user:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [accessToken]);

  const login = async (token) => {
    setAccessToken(token);
    localStorage.setItem("accessToken", token);
    try {
      const userData = await getUser({ auth: { accessToken: token } });
      setUser(userData.user);
    } catch (error) {
      console.error("Failed to fetch user after login:", error);
    }
  };

  const logout = () => {
    setAccessToken('');
    setUser(null);
    localStorage.removeItem('accessToken');
  }

  const auth = {
    accessToken,
    setAccessToken,
    user,
    setUser,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <CartProvider>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </CartProvider>
  </AuthContextProvider>
);
