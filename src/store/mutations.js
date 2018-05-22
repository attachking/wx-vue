import * as types from './mutation-types'

const mutations = {
  [types.SET_USER_INFO](state, o) {
    state.userInfo = o
  },
  [types.SET_COUNT](state, o) {
    state.count = o
  },
  [types.SET_DICTIONARIES](state, o) {
    state.dictionaries = o
  }
}

export default mutations
