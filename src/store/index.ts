import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 容器的状态只能实现共享，但是没有持久化的功能，刷新页面就没有了
  state: {
    user: JSON.parse(window.localStorage.getItem('user') || 'null')/// 当前用户登录状态
  },
  mutations: {
    setUser (state, payload) {
      state.user = JSON.parse(payload)
      // 持久化
      window.localStorage.setItem('user', payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
