import * as types from './mutation-types'

const mutations = {
  [types.SET_OPENID](state, o) {
    state.openid = o
  },
  [types.SET_WX_INFO](state, o) {
    state.wxInfo = o
  },
  [types.SET_USER_INFO](state, o) {
    state.userInfo = o
  },
  [types.SET_DICTIONARIES](state, o) {
    state.dictionaries = o
  }
}

export default mutations
