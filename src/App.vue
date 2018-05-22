<script>
  import {mapMutations} from 'vuex'

  export default {
    data() {
      return {
        cities: [] // 城市字典表
      }
    },
    methods: {
      ...mapMutations({
        setDictionaries: 'SET_DICTIONARIES'
      }),
      /*
      处理后的字典表结构为[{id: '', name: '', pid: ''}]
      id和pid均为String类型
      第一级pid为'0'
      * */
      getDictionaries() {
        this.$post('/service/sys/college/config/config/getConditionList.xf', {
          tabStr: 'TAB_CITY'
        }).then(res => {
          let cities = res.data.result.TAB_CITY.children
          this.handleCities(cities)
          this.setDictionaries({
            cities: this.cities
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
      }
    },
    created () {
      this.getDictionaries()
      // 调用API从本地缓存中获取数据
      const logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)

      console.log('app created and cache logs by setStorageSync')
    }
  }
</script>

<style lang="scss">
  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 200rpx 0;
    box-sizing: border-box;
  }
</style>
