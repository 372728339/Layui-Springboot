import Axios from "axios"

import store from "../store"
Axios.defaults.withCredentials = true

Axios.defaults.baseURL = "http://"+window.location.host+"/"
export function request(config) {
  const login = Axios.create({
    timeout: 5000
  })
  login.interceptors.request.use(config => {
    store.commit('showSubmit')
    return config
  })
  return login(config)
}

export function loadDoc(config,_self) {
  const doc = Axios.create({
    timeout: 5000
  })
  doc.interceptors.request.use(config => {
    _self.$Spin.show()
    return config
  })
  return doc(config)
}

export function exportItem(config,_self) {
  const doc = Axios.create({
    timeout: 5000
  })
  doc.interceptors.request.use(config => {
    _self.$Spin.show()
    return config
  })
  doc.interceptors.response.use(config => {
    const headers = config.headers
    if (headers['content-type'] === 'application/octet-stream;charset=utf-8') {
      return config.data
    }
  })
  return doc(config)
}