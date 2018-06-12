<template>
  <div class="me">
    <div class="unLogin" v-if="!userInfo.status">
      <span>您还没有登录，请先</span>
      <a href="/pages/tabs/login/main">登录</a>
    </div>
    <div class="menu" v-if="userInfo.status === 1">
      <div class="title">
        <div class="head">
          <img :src="userInfo.logo" mode="widthFix">
        </div>
        <div class="right">
          <div class="username">{{userInfo.username}}</div>
          <div v-if="userInfo.ccmu17 === 1">{{userInfo.ccmu02}}</div>
        </div>
      </div>
      <div class="list">
        <form-list arrow>
          <div slot="left">
            <span class="iconfont icon-jianli" style="color: rgb(245, 171, 57);"></span>
            <span slot="left">我的简历</span>
          </div>
        </form-list>
        <form-list arrow href="/pages/student/recommend/main">
          <div slot="left">
            <span class="iconfont icon-gongjubao" style="color: rgb(140, 192, 81);"></span>
            <span slot="left">推荐职位</span>
          </div>
        </form-list>
      </div>
    </div>
    <div class="logout">
      <button type="warn" @click="logout" v-if="userInfo.status === 1">退出登录</button>
    </div>
  </div>
</template>
<script>
  import {mapActions, mapGetters} from 'vuex'
  import FormList from '../../../components/form-list.vue'

  export default {
    components: {FormList},
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    data() {
      return {
        menus: []
      }
    },
    methods: {
      ...mapActions([
        'pullUserInfo'
      ]),
      logout() {
        this.$confirm('确定注销账号？').then(() => {
          this.$loading.show()
          return this.$post('/service/business/college/login/account/bindWechatUser.xf', {
            userId: this.userInfo.uid
          })
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
      },
      getMenu() {
        this.$post('/service/sys/college/config/menu/getMenuList.xf', {
          menuType: 10,
          plateForm: 2,
          ccmu17: 1
        }).then(res => {
          this.menus = res.data.result
        })
      }
    },
    onShow() {
      if (this.userInfo.status === 1) {
        // this.getMenu()
      }
    }
  }
</script>
<style lang="scss">
  @import "../../../common/style/variables";

  .me{
    font-size: 28rpx;
    background: #f3f3f3;
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
  .title{
    display: flex;
    align-items: center;
    padding: 20rpx 20rpx;
    background: #fff;
    .head{
      width: 150rpx;
      img{
        width: 100%;
      }
    }
    .right{
      flex-grow: 1;
      padding-left: 10rpx;
      .username{
        font-weight: bold;
      }
      div{
        padding: 15rpx 0 0 0;
      }
    }
  }
  .list{
    background: #fff;
    margin: 15rpx 0;
  }
</style>
