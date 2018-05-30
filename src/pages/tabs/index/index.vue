<template>
  <div class="container">
    <div class="title">
      <div class="text">郑大就创业</div>
      <div class="input">
        <icon type="search"></icon>
        <input v-model="keyWords" type="text" placeholder="搜索职位名/单位名/行业类别" confirm-type="search" @confirm="submit">
      </div>
    </div>
    <div class="selects">
      <div class="select">
        <multi-picker placeholder="职位类别" :multi="3" :list="dictionaries.positions" v-model="searchData.bca111" last></multi-picker>
        <image src="../../../static/img/arrow-down.png" class="arrow"></image>
      </div>
      <div class="select">
        <multi-picker placeholder="工作地区" :multi="2" :list="dictionaries.cities" v-model="searchData.acb202"></multi-picker>
        <image src="../../../static/img/arrow-down.png" class="arrow"></image>
      </div>
      <div class="select">
        <multi-picker placeholder="工作性质" :list="dictionaries.nature" v-model="searchData.aab019"></multi-picker>
        <image src="../../../static/img/arrow-down.png" class="arrow"></image>
      </div>
    </div>
  </div>
</template>

<script>
  import MultiPicker from '../../../components/multi-picker.vue'
  import {mapGetters} from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'dictionaries'
      ])
    },
    data () {
      return {
        searchData: {
          rowsNum: 10,
          currentPage: 1,
          bca111: '', // 职位类别
          acb202: '', // 地区
          aab019: '' // 工作性质
        },
        pageBean: {},
        keyWords: '',
        list: [],
        loading: false
      }
    },

    components: {
      MultiPicker
    },

    methods: {
      getList () {
        if (this.loading) return
        this.loading = true
        this.$post('/service/business/college/corp/newPosition/queryPositionList.xf', this.searchData).then(res => {
          this.loading = false
          this.pageBean = res.data.pageBean
          if (this.pageBean.currentPage === 1) {
            this.list = res.data.result
          } else {
            this.list = this.list.concat(res.data.result)
          }
        }).catch(() => {
          this.loading = false
        })
      },
      selectChange() {
        setTimeout(() => {
          this.searchData.currentPage = 1
          this.getList()
        }, 20)
      }
    },

    created () {
      this.getList()
      this.$watch('searchData.bca111', this.selectChange)
      this.$watch('searchData.acb202', this.selectChange)
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../common/style/variables";

  .title {
    background: $theme;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 0 30rpx 0;
    .text {
      color: #fff;
      font-size: 40rpx;
      padding: 10rpx 0 20rpx 0;
    }
    .input {
      width: 80%;
      border: 1rpx solid #d9d9d9;
      border-radius: 20rpx;
      display: flex;
      padding: 8rpx 10rpx;
      background: #fff;
      align-items: center;
      font-size: 28rpx;
      input {
        flex-grow: 1;
      }
    }
  }
  .selects{
    display: flex;
    font-size: 28rpx;
    .select{
      width: 33.3%;
      display: flex;
      align-items: center;
      justify-content: center;
      picker{
        max-width: 80%;
      }
    }
  }
  .arrow{
    width: 30rpx;
    height: 30rpx;
  }
</style>
