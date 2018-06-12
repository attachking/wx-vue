<template>
  <div class="recommend">
    <empty v-if="!loading && !list.length"></empty>
    <a class="item" v-for="(val, key) in list" :key="val.acb210" :href="'/pages/job/main?acb210=' + val.acb210">
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
          <div class="pos-area">{{val.bcb202}}</div>
        </div>
        <div class="pos-bot">
          <div>招聘人数：{{val.acb21r}}</div>
          <div class="pos-nature">{{val.acb21iName}}</div>
          <div class="pos-salary">{{val.acc034Name}}</div>
        </div>
      </div>
    </a>
    <no-more v-if="list.length && !pageBean.hasNextPage"></no-more>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {listMixins} from '../../../common/js/mixins'
  import {STATIC_URL, dateFormat} from '../../../common/js/utils'
  import Empty from '../../../components/empty.vue'
  import NoMore from '../../../components/no-more.vue'

  export default {
    ...listMixins,
    components: {
      NoMore,
      Empty},
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    data() {
      return {
        searchData: {
          aac001: '',
          currentPage: 1,
          rowsNum: 10,
          ccmu17: 1
        },
        loading: false,
        pageBean: {},
        list: []
      }
    },
    methods: {
      getList() {
        this.searchData.aac001 = this.userInfo.uid
        this.searchData.ccmu17 = this.userInfo.ccmu17
        if (this.loading) return
        this.loading = true
        this.$post('/service/business/college/search/jobRecommendList/getRecommendJobList.xf', this.searchData).then(res => {
          this.loading = false
          this.pageBean = res.data.pageBean
          res.data.result.forEach(item => {
            item.ccmu15 = STATIC_URL + item.ccmu15
            item.ccpr05 = dateFormat(item.ccpr05, 'yyyy-MM-dd')
          })
          if (this.pageBean.currentPage === 1) {
            this.list = res.data.result
          } else {
            this.list = this.list.concat(res.data.result)
          }
        }).catch(() => {
          this.loading = false
        })
      }
    },
    onShow() {
      this.searchData.currentPage = 1
      this.getList()
    }
  }
</script>
<style lang="scss">
  @import "../../../common/style/variables";

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
      min-height: 150rpx;
      flex-grow: 1;
      .pos-tit{
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 28rpx;
        .pos-name{
          color: $theme;
          font-size: 32rpx;
          max-width: 350rpx;
          @include ellipsis;
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
          @include ellipsis;
        }
        .pos-area{
          max-width: 200rpx;
          @include ellipsis;
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
