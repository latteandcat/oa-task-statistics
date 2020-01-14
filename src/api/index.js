import axios from 'axios'
import storage from '@/utils/storage'

const api = axios.create({
  timeout: 30000
})

/* 请求拦截器 */
api.interceptors.request.use((config) => {
  /* 取token */
  const token = storage.get('token')
  if (token) {
    config.headers['LOGIN-TOKEN'] = token
  }
  return config
}, (err) => {
  return Promise.reject(err)
})

/* 响应拦截器 */
api.interceptors.response.use((res) => {
  return res.data
}, (err) => {
  return Promise.reject(err)
})

export default api
