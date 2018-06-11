<template>
  <div class="preaching-detail">
    <div class="ct-title">
      <div class="ct-tit">{{info.ctTitle}}</div>
      <a class="ct-info" :href="'/pages/corporation/main?aab001=' + corpInfo.aab001">
        <img src="/static/img/corp.png" alt="">
        <div class="theme">{{corpInfo.aab004}}</div>
      </a>
      <div class="ct-info">
        <img src="/static/img/position.png" alt="">
        <div>{{info.crAddress}}</div>
      </div>
      <div class="ct-info">
        <img src="/static/img/time.png" alt="">
        <div>{{info.during}}</div>
      </div>
    </div>
    <div class="card">
      <div class="tit">
        <img src="/static/img/document.png" alt="">
        <div>宣讲会介绍</div>
      </div>
      <div class="card-con">
        <rich-txt :nodes="info.ctContent"></rich-txt>
      </div>
    </div>
    <div class="card">
      <div class="tit">
        <img src="/static/img/education.png" alt="">
        <div>宣讲会职位</div>
      </div>
      <div class="card-con">
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
              <div class="pos-area">{{val.bcb202name}}</div>
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
    </div>
  </div>
</template>
<script>
  import Empty from '../../components/empty.vue'
  import NoMore from '../../components/no-more.vue'
  import {dateFormat, STATIC_URL} from '../../common/js/utils'
  import RichTxt from '../../components/rich-txt.vue'

  export default {
    components: {
      RichTxt,
      NoMore,
      Empty},
    onShareAppMessage() {
      return {
        title: this.info.ctTitle,
        path: '/pages/preachingDetail/main?ctId=' + this.$root.$mp.query.ctId
      }
    },
    data() {
      return {
        search: {
          ctId: '',
          countsNum: 99999999
        },
        info: {},
        corpInfo: {},
        searchData: {
          ctId: '',
          rowsNum: 10,
          currentPage: 1
        },
        pageBean: {},
        list: [],
        loading: false
      }
    },
    methods: {
      getDetail() {
        this.$loading.bar()
        this.$post('/service/business/college/careertalk/CareerTalkInfo/carrerDetail.xf', this.search).then(res => {
          this.$loading.barHide()
          res.data.result.careerTalkInfo.during = `${dateFormat(res.data.result.careerTalkInfo.ctCareerStarttime, 'yyyy-MM-dd hh:mm')} -- ${dateFormat(res.data.result.careerTalkInfo.ctCareerEndtime, 'hh:mm')}`
          this.info = res.data.result.careerTalkInfo
          this.corpInfo = res.data.result.corpInfo
        }).catch(() => {
          this.$loading.barHide()
        })
      },
      getList() {
        if (this.loading) return
        this.loading = true
        this.$post('/service/business/college/corp/newPosition/getPositionList.xf', this.searchData).then(res => {
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
      }
    },
    onLoad() {
      this.search.ctId = this.$root.$mp.query.ctId
      this.searchData.ctId = this.$root.$mp.query.ctId
      this.getDetail()
      this.getList()
    }
  }
</script>
<style lang="scss">
  @import "../../common/style/variables";

  .preaching-detail{
    background: #f3f3f3;
    font-size: 28rpx;
  }
  .ct-title{
    padding: 20rpx 20rpx;
    background: #fff;
  }
  .ct-tit{
    font-weight: bold;
  }
  .ct-info{
    display: flex;
    align-items: center;
    padding: 15rpx 0 0 0;
    img{
      width: 35rpx;
      height: 35rpx;
      margin-right: 10rpx;
    }
  }
  .card{
    margin-top: 20rpx;
    background:#fff;
    .tit{
      display: flex;
      align-items: center;
      padding: 20rpx 30rpx;
      border-bottom: 1rpx solid #d9d9d9;
      img{
        width: 35rpx;
        height: 35rpx;
        margin-right: 10rpx;
      }
    }
    .card-con{
      padding: 20rpx 30rpx;
    }
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
