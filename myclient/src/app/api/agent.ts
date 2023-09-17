import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { store } from "../store/configStore";

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

axios.defaults.baseURL = 'http://localhost:7263/api/';

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.token;
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})


axios.interceptors.response.use(async response => {
    await sleep();
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
    get: (url: string) => axios.get(url).then(responseBody),
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
    console.log(formData);
    return formData;
}

const Account = {
    login: (values: any) => requests.post('account/login', values),
    register: (values: any) => requests.post('account/register', values),
    currentUser: () => requests.get('account/currentUser')
}

const AgriTypes = {
    agriTypes: () => requests.get('agriTypes'),
    agriType: (id: number) => requests.get(`agriTypes/${id}`),
    removeAgriType: (id: number) => requests.delete(`agriTypes/${id}`),
    addUpdateAgriType: (agriType: any) => requests.postForm('agriTypes', createFormData(agriType))
}

const agent = {
  Account,
  AgriTypes
}

export default agent;