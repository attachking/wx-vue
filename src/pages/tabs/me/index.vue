<template>
  <div class="me">
    <div class="unLogin" v-if="!userInfo.status">
      <span>您还没有登录，请先</span>
      <a href="/pages/tabs/login/main">登录</a>
    </div>
    <div class="menu" v-if="userInfo.status === 1"></div>
    <div class="logout">
      <button type="warn" @click="logout" v-if="userInfo.status === 1">退出登录</button>
    </div>
  </div>
</template>
<script>
  import {mapActions, mapGetters} from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    data() {
      return {}
    },
    methods: {
      ...mapActions([
        'pullUserInfo'
      ]),
      logout() {
        this.$loading.show()
        this.$post('/service/business/college/login/account/bindWechatUser.xf', {
          userId: this.userInfo.uid
        }).then(res => {
          this.$loading.hide()
          if (res.data.error.result === 1) {
            // 退出后再次获取用户信息
            this.pullUserInfo()
          }
          this.$toast(res.data.error.message)
        }).catch(() => {
          this.$loading.hide()
        })
      }
    }
  }
</script>
<style lang="scss">
  @import "../../../common/style/variables";

  .me{
    font-size: 28rpx;
  }
  .logout{
    padding: 20rpx 20rpx;
    background: #fff;
  }
  .unLogin{
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20rpx 0;
    a{
      color: $theme;
    }
  }
</style>
