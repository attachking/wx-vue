<script>
  import {mapMutations} from 'vuex'

  export default {
    data() {
      return {
        cities: [], // 城市字典表
        positions: [] // 职位字典表
      }
    },
    methods: {
      ...mapMutations({
        setDictionaries: 'SET_DICTIONARIES',
        setUserInfo: 'SET_USER_INFO'
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
      getUserInfo() {
        // 调用登录接口
        wx.login({
          success: res => {
            console.log(res)
            wx.getUserInfo({
              success: res => {
                this.setUserInfo(res.userInfo)
              }
            })
          }
        })
      }
    },
    created () {
      this.getDictionaries()
      this.getUserInfo()
    }
  }
</script>

<style lang="scss">
  @import "common/style/form";

</style>
