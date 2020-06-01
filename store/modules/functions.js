import Vue from 'vue'

export default {
  state: {},
  mutations: {
    updateFn(state, payload) {
      for (let i in payload) {
        Vue.set(state, payload[i].name, payload[i].privilege)
      }
    },
    updateFunction(state, payload) {
      state[payload.fun] = payload.privilege
    }
  },
  getters: {
    getPrivilege(state, getters, rootState) {
      return (func) => {
        return state[func] <= rootState.user.privilege ? true : false
      }
    }
  }
}