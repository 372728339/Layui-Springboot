import {loadDoc} from "../../network/request";

export default {
  state: {
    itemInfo: [],
    total: 0,
    type: ["装备", "药品", "翅膀", "坐骑", "法宝", "灵器", "时装", "法印", "头像", "飞行器", "符文", "变身卡", "家具", "宠物袋", "宠物书", "杂货", "仙侣", "称谓", "头衔", "宠物", "活动", "宠物技能", "装备特效"]
  },
  mutations: {
    updateItem(state, payload) {
      state.itemInfo.length = 0
      for (let i in payload) {
        payload[i].type = state.type[i]
        state.itemInfo.push(payload[i])
      }
    },
    clearItem(state) {
      state.itemInfo = []
    },
    itemTotal(state, payload) {
      state.total = payload
    }
  },
  actions: {
    getItem(state, _self) {
      loadDoc({
        url: '/user/itemList'
      }, _self).then(result => {
        const data = result.data
        const itemInfo = data.table
        if (data.resultCode === 1) {
          state.commit('updateItem', itemInfo)
          state.commit('itemTotal', data.total)
        }
        _self.$Spin.hide()
      }).catch(error => {
        console.log(error)
        _self.$Message.error('发生错误，请联系管理员')
      })
    }
  }
}