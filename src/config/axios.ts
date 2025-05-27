import axios from "axios"
import { apiUrl } from "./env"
import { ACCESS_TOKEN, USER_CURRENT } from "../shared/constants/auth"
import { message } from "antd"

export const instance = axios.create({ baseURL: apiUrl, withCredentials: true })

instance.interceptors.request.use(
  (config) => {
    const rawToken = localStorage.getItem(ACCESS_TOKEN)
    if (config.headers) {
      if (rawToken) config.headers.Authorization = `Bearer ${rawToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error)

    return Promise.reject(error)
  }
)
