import axios from "axios"
import { apiUrl } from "./env"
import { ACCESS_TOKEN } from "../shared/constants/auth"

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

// instance.interceptors.response.use(
//   function (response) {
//     const newToken = response.headers["x-new-access-token"]
//     if (newToken) {
//       localStorage.setItem(ACCESS_TOKEN, newToken)
//     }
//     return response
//   },
//   function (error) {
//     return Promise.reject(error)
//   }
// )
