 import axios from 'axios'

const request = axios.create({
  baseURL: 'api/',
  timeout: 5000 // 超时的时间设置
})
// 给request实例添加请求与响应拦截器
request.interceptors.request.use((config) => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // return config;
})
// 对外暴露
export default request
