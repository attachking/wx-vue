import * as types from './mutation-types'
import {post, STATIC_URL} from '../common/js/utils'

export const pullUserInfo = function ({commit, state}, name) {
  post('/service/business/college/login/account/bindWechatUser.xf', {
    openId: state.openid,
    appType: 1
  }).then(res => {
    if (res.data.error && res.data.error.result === 1) {
      commit(types.SET_USER_INFO, {
        status: 1,
        ccmu17: Number(res.data.result.ccmu17),
        uid: Number(res.data.result.ccmu17) === 1 ? res.data.result.aac001 : res.data.result.aab001,
        logo: STATIC_URL + res.data.result.logo,
        username: res.data.result.userName,
        ccmu01: res.data.result.userid,
        ccmu02: res.data.result.ccmu02
      })
    } else {
      commit(types.SET_USER_INFO, {})
    }
  })
}
