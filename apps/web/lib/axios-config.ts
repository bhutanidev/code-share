import axios from "axios";

export const httpAxios = axios.create({
    baseURL:"http://localhost:3001",
    withCredentials:true
})
