import Vue from 'vue';

export default {
  state: {},
  getters: {
    getUserInfo(state) {
      const userInfo = {
        username: state.username,
        roleName: state.roleName,
        privilege: state.privilege
      }
      return userInfo
    }
  },
  mutations: {
    updateInfo(state,payload) {
      for (let i in payload) {
        Vue.set(state,i,payload[i])
      }
    }
  }
}