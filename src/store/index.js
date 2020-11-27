import Vue from 'vue'
import Vuex from 'vuex'
import Users from './modules/users'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: 'Users'
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    Users
  }
})
