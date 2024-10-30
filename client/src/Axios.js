import axios from 'axios';
// const BASE_URL = 'http://localhost:8081/api';
const BASE_URL = 'http://43.204.108.73:8344/api';


export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    // baseURL: BASE_URL,
    // headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});