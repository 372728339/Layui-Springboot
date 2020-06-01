export default {
  updateCode(state, payload) {
    state.codeInfo.length = 0
    for (let i in payload) {
      state.codeInfo.push(payload[i])
    }
  },
  codeTotal(state, payload) {
    state.total = payload
  }
}