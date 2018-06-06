<template>
  <div class="container">
    <div class="title">
      <div class="text">郑大就创业</div>
      <div class="input">
        <icon type="search"></icon>
        <input v-model.lazy="keyWords" type="text" placeholder="搜索职位名/单位名/行业类别" confirm-type="search" @confirm="submit">
      </div>
    </div>
    <div class="selects">
      <div class="select">
        <div class="multi-picker">
          <better-picker v-model="searchData.bca111" :list="dictionaries.positions" placeholder="职位类别" :multi="3" last></better-picker>
        </div>
        <image src="../../../static/img/arrow-down.png" class="arrow"></image>
      </div>
      <div class="select">
        <div class="multi-picker">
          <better-picker v-model="searchData.acb202" :list="dictionaries.cities" placeholder="工作地区" :multi="2"></better-picker>
        </div>
        <image src="../../../static/img/arrow-down.png" class="arrow"></image>
      </div>
      <div class="select">
        <div class="multi-picker">
          <better-picker v-model="searchData.aab019" :list="dictionaries.nature" placeholder="工作性质"></better-picker>
        </div>
        <image src="../../../static/img/arrow-down.png" class="arrow"></image>
      </div>
    </div>
    <div class="list">
      <empty v-if="!loading && !list.length"></empty>
      <div class="item" v-for="(val, key) in list" :key="val.acb210">
        <div class="img">
          <image :src="val.ccmu15"></image>
        </div>
        <div class="con">
          <div class="pos-tit">
            <div class="pos-name">{{val.cca113}}</div>
            <div class="pos-time">{{val.ccpr05}}</div>
          </div>
          <div class="pos-mid">
            <div class="pos-corp">{{val.aab004}}</div>
            <div>{{val.bcb202}}</div>
          </div>
          <div class="pos-bot">
            <div>招聘人数：{{val.acb21r}}</div>
            <div class="pos-nature">{{val.acb21iName}}</div>
            <div class="pos-salary">{{val.acc034Name}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import BetterPicker from '../../../components/better-picker.vue'
  import {listMixins} from '../../../common/js/mixins'
  import {STATIC_URL, dateFormat} from '../../../common/js/utils'
  import Empty from '../../../components/empty.vue'

  export default {
    ...listMixins,
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
          aab019: '', // 工作性质
          bca112: '' // 关键字
        },
        pageBean: {},
        keyWords: '',
        list: [],
        loading: false
      }
    },
    components: {
      Empty,
      BetterPicker
    },
    methods: {
      getList () {
        if (this.loading) return
        this.loading = true
        this.$post('/service/business/college/corp/newPosition/queryPositionList.xf', this.searchData).then(res => {
          this.loading = false
          this.pageBean = res.data.pageBean
          res.data.result.forEach(item => {
            item.ccpr05 = dateFormat(item.ccpr05, 'yyyy-MM-dd')
            item.ccmu15 = STATIC_URL + item.ccmu15
          })
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
      },
      submit() {
        this.searchData.bca112 = this.keyWords
        this.searchData.currentPage = 1
        this.getList()
      }
    },
    created () {
      this.getList()
      this.$watch('searchData.bca111', this.selectChange)
      this.$watch('searchData.acb202', this.selectChange)
      this.$watch('searchData.aab019', this.selectChange)
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
        padding: 0 0 0 10rpx;
      }
    }
  }
  .selects{
    display: flex;
    font-size: 28rpx;
    padding: 10rpx 0;
    .select{
      width: 33.3%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .multi-picker{
      max-width: 80%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .arrow{
    width: 30rpx;
    height: 30rpx;
    margin-left: 10rpx;
  }
  .item{
    padding: 20rpx 20rpx;
    display: flex;
    align-items: center;
    &:not(:last-child){
      border-bottom: 1rpx dashed #d9d9d9;
    }
    .img{
      width: 150rpx;
      height: 150rpx;
      image{
        width: 100%;
        height: 100%;
      }
    }
    .con{
      padding: 0 0 0 20rpx;
      box-sizing: border-box;
      height: 150rpx;
      flex-grow: 1;
      .pos-tit{
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 28rpx;
        .pos-name{
          color: $theme;
        }
      }
      .pos-mid{
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 28rpx;
        padding: 15rpx 0;
        .pos-corp{
          max-width: 350rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .pos-bot{
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 28rpx;
        .pos-salary{
          color: red;
        }
      }
    }
  }
</style>
