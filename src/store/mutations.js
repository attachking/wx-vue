import * as types from './mutation-types'

const mutations = {
  [types.SET_USER_INFO](state, o) {
    state.userInfo = o
  },
  [types.SET_COUNT](state, o) {
    state.count = o
  }
}

export default mutations
