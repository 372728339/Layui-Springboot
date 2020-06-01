import Vue from 'vue'
import Vuex from 'vuex'
import mutations from "./mutations"
import actions from "./actions"
import login from "./modules/login"
import user from "./modules/user"
import functions from "./modules/functions"
import item from "./modules/item";

Vue.use(Vuex)
const state = {
  loading: false,
  total: 0,
  codeInfo: []
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {login, user,functions,item}
})

export default store