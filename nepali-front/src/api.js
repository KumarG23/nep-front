import axios from "axios";
export const url = import.meta.env.VITE_URL
console.log('url: ', url);
// export const url = 'https://nep-back.fly.dev';
// export const url = 'http://127.0.0.1:8000'
export const createUser = ({ username, email, password, firstName, lastName }) => {
    axios({
        method: 'post',
        url: `${url}/user/create/`,
        data: {
            username,
            email,
            password,
            first_name: firstName,
            last_name: lastName,
        },
    })
    .then ((response) => {
        console.log('createUser: ', response);
    })
    .catch((error) => console.log('error: ', error));
};

export const getToken = async ({ username, password }) => {
    try {
        const response = await axios.post(`${url}/token/`,{
            username,
            password,
        });
        console.log('token response: ', response);
        return response.data.access;
    }
    catch (error) {
        console.log('error: ', error);
        throw error;
    };
};

export const getUser = async ({ auth }) => {
    try {
        const response = await axios({
            method: 'get',
            url: `${url}/user/profile/`,
            headers: {
                Authorization: `Bearer ${auth.accessToken}`,
            },
        });
        console.log('Get user: ', response);
        return response.data;
    }
    catch (error) {
        console.error('Error getting user: ', error)
        throw error;
    }
};

export const getProducts = async () => {
    try {
        const response = await axios ({
            url: `${url}/products/`,
            method: 'get',
        })
        console.log('getProducts: ', response)
        return response.data;
    }
    catch (error) {
        console.error('error getting products: ', error);
        throw error;
    }
}

export const getUserOrders = async ({ auth }) => {
    try {
        const response = await axios({
            method: 'get',
            url: `${url}/orders/get/`,
            headers: {
                Authorization: `Bearer ${auth.accessToken}`
            },
        });
        console.log('get user orders: ', response);
        console.log('user order data: ', response.data);
        return response.data;
    }
    catch (error) {
        console.error('error getting user orders: ', error);
        throw error;
    }
};


export const submitReview = async (reviewData, accessToken) => {
    try {
        const response = await axios.post(`${url}/reviews/create/`, reviewData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log('Review: ', response);
        return response.data;
    }
    catch (error) {
        if (error.response) {
            // Server responded with a status other than 200 range
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
            // Request was made but no response was received
            console.error('Error request:', error.request);
        } else {
            // Something happened in setting up the request that triggered an error
            console.error('Error message:', error.message);
        }
        console.error('Error config:', error.config);
        throw error;
    }
};


export const getProductById = async (id) => {
    try {
      const response = await axios({
        url: `${url}/products/${id}/`,
        method: 'get',
      });
      console.log('getProductById: ', response);
      return response.data;
    } catch (error) {
      console.error('error getting product by id: ', error);
      throw error;
    }
  };

  export const getReviewsByProductId = async (productId) => {
    try {
      const response = await axios.get(`${url}/reviews/?product_id=${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  };

