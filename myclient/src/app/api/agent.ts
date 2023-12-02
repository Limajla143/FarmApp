import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { store } from "../store/configStore";
import { PaginatedResponse } from "../models/pagination";

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

axios.defaults.baseURL = 'http://localhost:7263/api/';

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.token;
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axios.interceptors.response.use(async response => {
    await sleep();
    const pagination = response.headers['pagination'];
    if(pagination) {
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
        return response;
    }
    return response
}, (error: AxiosError) => {
    const {data, status} = error.response as AxiosResponse;
    switch(status) {
        case 400:
            if(data.errors) {
                const modelStateErrors: string[] = [];
                for(const key in data.errors) {
                    if(data.errors[key]) {
                        modelStateErrors.push(data.errors[key])
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(data.message);
            break;
        case 401:
            toast.error(data.message);
            break;
        case 403: 
            toast.error('You are not authorized for this!');
            break;
        case 404:
            router.navigate('/not-found', {state: {error: data}});
            break;
        case 500:
            router.navigate('/server-error', {state: {error: data}});
            break;
        default:
            break;
    }
    return Promise.reject(error.response);
})

const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, {params}).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
    postForm: (url: string, data: FormData) => axios.post(url, data, {
        headers: {'Content-type': 'multipart/form-data'}
    }).then(responseBody),
    putForm: (url: string, data: FormData) => axios.put(url, data, {
        headers: {'Content-type': 'multipart/form-data'}
    }).then(responseBody)
}

function createFormData(item: any) {
    let formData = new FormData();
    for (const key in item) {
        formData.append(key, item[key])
    }
    return formData;
}

function createFormDataNested(item: any) {
    const formData = new FormData();

    const flattenObject = ((obj : any, parentKey = '') => {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const nestedKey = parentKey ? `${parentKey}.${key}` : key;
                const value = obj[key];
                if (typeof value === 'object' && value !== null) {
                    // Recursively flatten nested objects
                    flattenObject(value, nestedKey);
                } else {
                    // Append the value as a flat field
                    if(key != 'file') {
                        formData.append(nestedKey, value);
                    }
                }
            }
        }
    })
    flattenObject(item);
    if (item.file) {
        formData.append('file', item.file);
    }

    if(Array.isArray(item.roles)) {
        item.roles.forEach((role: string, index: number) => {
            formData.append(`roles[${index}]`, role)
        });
    }
    return formData;
}

const Account = {
    login: (values: any) => requests.post('account/login', values),
    register: (values: any) => requests.post('account/register', values),
    currentUser: () => requests.get('account/currentUser'),
    getUserAddress: () => requests.get('account/getAddress'),
    confirmEmail: (userId: string, token: string) => requests.post(`account/confirmemail?userId=${userId}&token=${token}`, {}),
    forgotPassword: (useremail: string) => requests.post(`account/forgotpassword?useremail=${useremail}`, {}),
    resetPassword: (values: any) => requests.post('account/resetpassword', values),
    getUserByUser: () => requests.get(`account/getUserByUser`),
}

const Admin = {
    getUsersForAdmin: (params: URLSearchParams) => requests.get('accountAdmin/getUsersByAdmin', params),
    updateUserForAdmin: (userProfileDto: any) => requests.putForm('accountAdmin/updateUser', createFormDataNested(userProfileDto)),
    getRoles: () => requests.get('accountAdmin/getRoles')
}

const AgriTypes = {
    agriTypes: (params: URLSearchParams) => requests.get('agriTypes', params),
    agriType: (id: number) => requests.get(`agriTypes/${id}`),
    removeAgriType: (id: number) => requests.delete(`agriTypes/${id}`),
    addUpdateAgriType: (agriType: any) => requests.postForm('agriTypes', createFormData(agriType))
}

const Products = {
    products: (params: URLSearchParams) => requests.get('products/getProducts', params),
    product: (id: number) => requests.get(`products/getProduct/${id}`),
    removeProduct: (id: number) => requests.delete(`products/${id}`),
    addUpdateProduct: (product: any) => requests.postForm('products/addUpdateProduct', product)
}

const ProductForUsers = {
    fetchfilters: () => requests.get('usersProduct/prodFilters'),
    products: (params: URLSearchParams) => requests.get('usersProduct/getProducts', params),
    product: (id: number) => requests.get(`usersProduct/getProduct/${id}`)
}

const Basket = {
    getBasketItem: () => requests.get('basket/getBasket'),
    addBasketItem: (productId: number, quantity = 1) => requests.post(`basket/addItemToBasket?productId=${productId}&quantity=${quantity}`, {}),
    removeBasketItem: (productId: number, quantity = 1) => requests.delete(`basket/removeItemFromBasket?productId=${productId}&quantity=${quantity}`),
    deliveryMethodForBasket: (deliveryMethodId: number) => requests.post(`basket/deliveryMethodForBasket?deliveryMethodId=${deliveryMethodId}`, {})
}

const Orders = {
    getOrders: (params: URLSearchParams) => requests.get('orders/getOrdersForUsers', params),
    getOrder: (id: number) => requests.get(`orders/getOrderByIdForUser/${id}`),
    createOrder: (values: any) => requests.post('orders/createOrder', values),
    getdeliverMethods: () => requests.get('orders/deliveryMethods'),
    removeOrder: (id: number) => requests.delete(`orders/removeOrder/${id}`)
}

const Payments = {
    createPaymentIntent: (basketId: string) => requests.post(`payments/createPaymentIntent?basketId=${basketId}`, {})
}

const Home = {
    getHomeImages: () => requests.get('home/getHomeImages')
}

const TestErrors = {
    get400Error: () => requests.get('testerror/bad-request'),
    get401Error: () => requests.get('testerror/test-auth'),
    get404Error: () => requests.get('testerror/not-found'),
    get500Error: () => requests.get('testerror/server-error'),
    getValidationError: () => requests.get('testerror/validation-error')
}

const agent = {
  Account,
  AgriTypes,
  Admin,
  Products,
  ProductForUsers,
  Basket,
  Orders,
  Payments,
  Home,
  TestErrors
}

export default agent;