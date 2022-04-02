import axios, { AxiosRequestConfig } from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'
const request = axios.create({
  // 配置选项
  // baseURl
  baseURL: '/api'
  // timeOut
})

// 重新登录
function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath///
    }
  })
}
// 重新获取token
function refreshToken () { /// /如果有提供刷新token的接口，如果没有提供，则退出到登录页面，要求重新登录
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  })
}
// 请求拦截器
request.interceptors.request.use(function (config:AxiosRequestConfig) {
  // 我们就在这里通过改写 config 配置信息来实现业务功能的统一处理
  const { user } = store.state
  if (user && user.access_token && config.headers) {
    config.headers.Authorization = user.access_token
  }
  // 注意：这里一定要返回 config，否则请求就发不出去了
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截器
let isRfreshing = false // 控制刷新 token 的状态
let requests: Array<() => void> = [] // 存储刷新 token 期间过来的 401 请求
request.interceptors.response.use(function (response) { /// /浏览器的2**的状态码到此
  // 如果是自定义错误状态码，错误处理就写到这里
  return response
}, async function (error) { // 非2**的状态码到此
  // 如果是使用的 HTTP 状态码，错误处理就写到这里
  if (error.response) { // 请求发出去收到响应了，但是状态码超出了 2xx 范围
    const { status } = error.response
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      if (!store.state.user) {
      // token 无效（没有提供 token、token 是无效的、token 过期了）
      // 如果有 refresh_token 则尝试使用 refresh_token 获取新的 access_token
        if (!store.state.user) {
          redirectLogin()
          return Promise.reject(error)
        }
        // 刷新token
        if (!isRfreshing) { /// /多个方法都测到token过期时，同时两个接口都收到401去刷新token
          // 第二个请求会失败，因为refresh只能使用一次，但返回的还是200的话，就无法被catch捕获，就会继续将store的值设为null,导致最后返回到login页面
          isRfreshing = true // 开启刷新状态
          // 尝试刷新获取新的 token
          return refreshToken().then(res => {
            if (!res.data.success) {
              throw new Error('刷新 Token 失败')
            }

            // 刷新 token 成功了
            store.commit('setUser', res.data.content)
            // 把 requests 队列中的请求重新发出去，多个请求时，刷新成功后，需将后续的请求继续发出去
            requests.forEach(cb => cb())
            // 重置 requests 数组，因为存在请求失败情况，数组需要清空
            requests = []
            return request(error.config)
          }).catch(err => {
            console.log(err)
            Message.warning('登录已过期，请重新登录')
            store.commit('setUser', null)
            redirectLogin()
            return Promise.reject(error)
          }).finally(() => {
            isRfreshing = false // 重置刷新状态
          })
        }
        // 刷新状态下，把请求挂起放到 requests 数组中
        return new Promise(resolve => {
          requests.push(() => {
            resolve(request(error.config))
          })
        })
      }
    } else if (status === 403) {
      Message.error('没有权限，请联系管理员')
    } else if (status === 404) {
      Message.error('请求资源不存在')
    } else if (status >= 500) {
      Message.error('服务端错误，请联系管理员')
    }
  } else if (error.request) { // 请求发出去没有收到响应
    Message.error('请求超时，请刷新重试')
  } else { // 在设置请求时发生了一些事情，触发了一个错误
    Message.error(`请求失败：${error.message}`)
  }
  // 把请求失败的错误对象继续抛出，扔给上一个调用者
  return Promise.reject(error)
})
export default request
