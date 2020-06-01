import {loadDoc} from "../../network/request";

export default {
  state: {
    loginBox: false,
    submit: false,
    loginStatus: false,
    tabValue: 'login',
    min: 99,
    isGm: false,
    isAdmin: false
  },
  mutations: {
    showLoginBox(state) {
      state.loginBox = true
    },
    hideLoginBox(state) {
      state.loginBox = false
    },
    showSubmit(state) {
      state.submit = !state.submit
    },
    hideSubmit(state) {
      state.submit = false
    },
    login(state) {
      state.loginStatus = true
    },
    logout(state) {
      state.loginStatus = false
    },
    changeTab(state, value) {
      state.tabValue = value
    },
    minPrivilege(state, payload) {
      state.min = payload
    },
    changeGm(state,payload){
      state.isGm = payload
    },
    changeAdmin(state,payload){
      state.isAdmin = payload
    }
  },
  actions: {
    init({commit, state, dispatch, rootState}, _self) {
      return new Promise(((resolve, reject) => {
        loadDoc({
          url: '/user/init'
        }, _self).then(result => {
          commit('updateFn', result.data.func.table)
          let reg = /^gm/
          let fn = rootState.functions
          for (let i in fn) {
            if (reg.test(i) && fn[i] < state.min) {
              commit('minPrivilege', fn[i])
            }
          }
          _self.$Spin.hide()
          resolve()
        }).catch(error => {
          console.log(error)
          _self.$Message.error('发生错误，请联系管理员')
          reject()
        })
      }))
    }
  }
}