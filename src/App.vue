<script>
  import {mapMutations, mapActions} from 'vuex'

  export default {
    data() {
      return {
        cities: [], // 城市字典表
        positions: [] // 职位字典表
      }
    },
    methods: {
      ...mapActions([
        'pullUserInfo'
      ]),
      ...mapMutations({
        setDictionaries: 'SET_DICTIONARIES',
        setWxInfo: 'SET_WX_INFO',
        setUserInfo: 'SET_USER_INFO',
        setOpenid: 'SET_OPENID'
      }),
      /*
      处理后的字典表结构为[{id: '', name: '', pid: ''}]
      id和pid均为String类型
      第一级pid为'0'
      * */
      getDictionaries() {
        this.$post('/service/sys/college/config/config/getConditionList.xf', {
          tabStr: 'TAB_CITY,CRAFT_AS,TAB_NATURE'
        }).then(res => {
          let cities = res.data.result.TAB_CITY.children
          let positions = res.data.result.CRAFT_AS.children
          this.handleCities(cities)
          this.handlePositions(positions)
          this.setDictionaries({
            cities: this.cities,
            positions: this.positions,
            nature: res.data.result.TAB_NATURE.map(item => {
              return {
                id: item.code + '',
                name: item.name,
                pid: '0'
              }
            })
          })
        })
      },
      handleCities(cities) {
        cities.forEach(item => {
          this.cities.push({
            id: item.id + '',
            name: item.text,
            pid: item.parentId + ''
          })
          if (item.children && item.children.length) this.handleCities(item.children)
        })
      },
      handlePositions(positions) {
        positions.forEach(item => {
          this.positions.push({
            id: item.id + '',
            name: item.text,
            pid: item.parentId + ''
          })
          if (item.children && item.children.length) this.handlePositions(item.children)
        })
      },
      getWxUserInfo() {
        // 调用登录接口
        wx.login({
          success: res => {
            this.getOpenid(res.code)
            wx.getUserInfo({
              success: res => {
                this.setWxInfo(res.userInfo)
              }
            })
          }
        })
      },
      getOpenid(jsCode) {
        this.$post('/service/business/college/login/account/getWechatOpenId.xf', {jsCode}).then(res => {
          if (res.data.result.openid) {
            this.setOpenid(res.data.result.openid)
            this.pullUserInfo()
          }
        })
      }
    },
    created () {
      this.getDictionaries()
      this.getWxUserInfo()
    }
  }
</script>

<style lang="scss">
  @import "common/style/variables";
  @import "common/style/form";
  @import "../static/font/iconfont.css";

  .red{
    color: red;
  }
  .theme{
    color: $theme;
  }
  .form-list{
    display: flex;
    padding: 20rpx 20rpx;
    align-items: center;
    .form-list-label{
      display: flex;
      align-items: center;
      .iconfont{
        margin-right: 10rpx;
        font-size: 40rpx;
      }
    }
    .form-list-right{
      flex: 1;
    }
    .form-list-icon{
      padding-left: 10rpx;
      .iconfont{
        font-size: 40rpx;
        color: #666;
      }
    }
    &:not(:last-child){
      border-bottom: 1rpx solid #d9d9d9;
    }
  }
</style>
