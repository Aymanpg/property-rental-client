import axios from 'axios'

const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

axiosSecure.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('Unauthorized or Forbidden request')
    }
    return Promise.reject(error)
  }
)

export default axiosSecure