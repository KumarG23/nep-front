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

