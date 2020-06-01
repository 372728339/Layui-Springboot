import {loadDoc} from "../network/request";

export default {
  getCode(state, _self) {
    loadDoc({
      url: '/gm/findRegCodeList'
    },_self).then(result => {
      const data = result.data
      const codeInfo = data.table
      if (data.resultCode === 1) {
        state.commit('updateCode',codeInfo)
        state.commit('codeTotal',data.total)
      }
      _self.$Spin.hide()
    }).catch(error => {
      console.log(error)
      _self.$Message.error('发生错误，请联系管理员')
    })
  }
}