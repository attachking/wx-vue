<template>
  <div class="login">
    <div class="title">
      <div>{{loginType}}</div>
    </div>
    <div class="form">
      <div class="row">
        <div class="label">
          <span class="required">*</span>
          <span>账号：</span>
        </div>
        <div class="input">
          <input type="text" placeholder="请输入账号" v-model.lazy="form.userAccount">
        </div>
      </div>
      <div class="row">
        <div class="label">
          <span class="required">*</span>
          <span>密码：</span>
        </div>
        <div class="input">
          <input type="password" placeholder="请输入密码" v-model.lazy="form.userPassword">
        </div>
      </div>
      <div class="row">
        <div class="submit-con">
          <button type="primary" @click="submit">确定</button>
        </div>
        <div class="submit-con">
          <button type="default" @click="cancel">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {STORAGE_TYPE, STATIC_URL} from '../../../common/js/utils'
  import md5 from 'blueimp-md5'
  import {mapMutations} from 'vuex'

  export default {
    data() {
      return {
        form: {
          userAccount: '',
          userPassword: '',
          openId: '',
          appType: 1 // 登录
        }
      }
    },
    methods: {
      ...mapMutations({
        setUserInfo: 'SET_USER_INFO'
      }),
      submit() {
        this.$form.validate({
          userAccount: [{
            required: true,
            msg: '请输入账号'
          }, function(value) {
            if (/^.{1,16}$/.test(value)) {
              return true
            } else {
              return new Error('账号长度不能超过16位')
            }
          }],
          userPassword: [{
            required: true,
            msg: '请输入密码'
          }, function(value) {
            if (/^.{1,16}$/.test(value)) {
              return true
            } else {
              return new Error('密码长度不能超过16位')
            }
          }]
        }, this.form).then(valid => {
          if (valid.status === 1) {
            this.$loading.show()
            let o = Object.assign({}, this.form)
            o.userPassword = md5(o.userPassword)
            this.$post('/service/business/college/login/account/bindWechatUser.xf', o).then(res => {
              this.$loading.hide()
              this.$toast(res.data.error.message)
              if (res.data.error.result === 1) {
                this.setUserInfo({
                  status: 1,
                  ccmu17: Number(res.data.result.ccmu17),
                  uid: Number(res.data.result.ccmu17) === 1 ? res.data.result.aac001 : res.data.result.aab001,
                  logo: STATIC_URL + res.data.result.logo,
                  username: res.data.result.userName,
                  ccmu01: res.data.result.userid,
                  ccmu02: res.data.result.ccmu02
                })
                this.$router.back()
              }
            }).catch(() => {
              this.$loading.hide()
            })
          } else {
            this.$toast(valid.msg)
          }
        })
      },
      cancel() {
        this.$router.back()
      }
    },
    onShow() {
      this.form.openId = this.$storage.get(STORAGE_TYPE.openid)
    }
  }
</script>
