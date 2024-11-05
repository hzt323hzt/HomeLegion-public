import axios, {AxiosRequestHeaders} from "axios";
import { createBrowserHistory } from "history";
import {ReqParam} from "./reqParam";
import {ReqBody} from "./reqBody";
// import {user_token_key} from "../utils/user";
import {Resp} from "./resp";
import {access_token,setToken} from "../vars/GlobalVars"

axios.defaults.withCredentials = true;

const history = createBrowserHistory();
const baseUrl = 'http://localhost:5000/api'
const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "127.0.0.1:*"
    }
});

const axiosTempInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "127.0.0.1:*"
    }
});
let inTokenQuery = false

export const fetchAccessToken = async () => {
    inTokenQuery = true;
    try {
        const response = await axiosTempInstance.get('/generate_token');
        const new_token:string = response.data.token
        setToken(new_token)
        inTokenQuery = false
        return new_token;  // Adjust according to the response structure
    } catch (error) {
        console.error('Error fetching token:', error);
        inTokenQuery = false
        // throw error;  // Rethrow the error for handling in calling code
    }
};
axiosInstance.interceptors.request.use(
    function (config) {
        const token = access_token
        if (token === undefined && !inTokenQuery){ 
            fetchAccessToken();
        }
        config.headers['Authorization'] = `Bearer ${token}`;
        return config
    },
    function (error) {
        return Promise.reject(error)
    }
)
//
//
// axios.interceptors.response.use(
//     function (response) {
//         const token = response.headers[user_token_key]
//         if (token != null) {
//             localStorage.setItem(user_token_key, token)
//         }
//         return response
//     },
//     function (error) {
//         const status = error.response?.status
//         switch (status) {
//             case 401:
//                 const res: Resp = error.response.data as Resp
//                 const {code} = res
//                 switch (code) {
//                     case -2:
//                         history.replace("/login");
//                         break
//                     case -3:
//                         history.replace("/home");
//                         break;
//                 }
//                 break;
//             default:
//                 history.replace("/error");
//                 break;
//         }
//         return Promise.reject(error);
//     })

// let config = {
//     headers: {
//         "Access-Control-Allow-Origin": "127.0.0.1:*"
//     }
//   }
export function toQueryString(param: any = {}): string {
    let paramStr: string = ''
    for (let key in param) {
        paramStr += key + '=' + param[key] + '&'
    }
    if (paramStr) {
        paramStr = '?' + paramStr.substring(0, paramStr.length - 1)
    }
    return paramStr
}


export function get(url: string, param: ReqParam = {}) {
    return axiosInstance.get(url + toQueryString(param))
}

export function post(url: string, param: ReqParam = {}, data: ReqBody = {}) {
    return axiosInstance.post(url + toQueryString(param), data)
}

export function put(url: string, param: ReqParam = {}, data: ReqBody = {}) {
    return axiosInstance.put(url + toQueryString(param), data)
}

export function del(url: string, param: ReqParam = {}, data: ReqBody = {}) {
    return axiosInstance.delete(url + toQueryString(param), {data})
}






