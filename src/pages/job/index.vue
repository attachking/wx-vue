<template>
  <div class="job-detail">
    <div class="desc">
      <div class="title-con">
        <div class="title">{{positionInfo.cca113}}</div>
        <div class="red">{{positionInfo.acc034Name}}</div>
      </div>
      <a class="corp-name" :href="'/pages/corporation/main?aab001=' + corpInfo.aab001">{{positionInfo.aab004}}</a>
      <div class="row">
        <div class="col">
          <img src="/static/img/position.png">
          <div>{{positionInfo.bcb202}}</div>
        </div>
        <div class="col">
          <img src="/static/img/education.png">
          <div>{{positionInfo.aac012 || '--'}}</div>
        </div>
        <div class="col">
          <img src="/static/img/tools.png">
          <div>{{positionInfo.acb21iName}}</div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <img src="/static/img/document.png">
          <div>工作经验：{{positionInfo.acc218}}</div>
        </div>
        <div class="col">
          <img src="/static/img/people.png">
          <div>招聘人数：{{positionInfo.acb21r}}</div>
        </div>
        <div class="col">
          <div>{{positionInfo.date}}</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="tit">
        <img src="/static/img/welfare.png" alt="">
        <div>福利待遇</div>
      </div>
      <div class="card-con">
        <div class="welfare" v-for="(val, key) in welfare" :key="key">{{val}}</div>
      </div>
    </div>
    <div class="card">
      <div class="tit">
        <img src="/static/img/document.png" alt="">
        <div>岗位职责</div>
      </div>
      <div class="card-con">{{positionInfo.cca114}}</div>
    </div>
    <div class="card">
      <div class="tit">
        <img src="/static/img/recommend.png" alt="">
        <div>推荐职位</div>
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
      </div>
    </div>
  </div>
</template>
<script>
  import {dateFormat, STATIC_URL} from '../../common/js/utils'

  export default {
    data() {
      return {
        searchData: {
          acb210: ''
        },
        corpInfo: {},
        positionInfo: {},
        welfare: [],
        list: []
      }
    },
    methods: {
      getDetail() {
        this.$loading.bar()
        this.$post('/service/business/college/corp/newPosition/getPositionDetail.xf', this.searchData).then(res => {
          this.$loading.barHide()
          this.corpInfo = res.data.result.corpInfo || {}
          if (res.data.result.positionInfo) {
            res.data.result.positionInfo.date = dateFormat(res.data.result.positionInfo.ccpr05, 'yyyy-MM-dd')
            this.welfare = (res.data.result.positionInfo.acc214name || '').split(',')
          }
          this.positionInfo = res.data.result.positionInfo || {}
        }).catch(() => {
          this.$loading.barHide()
        })
      },
      getList(acb210) {
        this.$post('/service/business/college/corp/newPosition/getRecommendJob.xf', {
          acb210,
          rowsNum: 5
        }).then(res => {
          res.data.result.forEach(item => {
            item.ccpr05 = dateFormat(item.ccpr05, 'yyyy-MM-dd')
            item.ccmu15 = STATIC_URL + item.ccmu15
          })
          this.list = res.data.result
        })
      }
    },
    onLoad() {
      let query = this.$root.$mp.query
      this.searchData.acb210 = query.acb210
      this.getDetail()
      this.getList(query.acb210)
    },
    created() {}
  }
</script>
<style lang="scss">
  @import "../../common/style/variables";

  .job-detail{
    font-size: 28rpx;
    background: #f3f3f3;
  }
  .desc{
    background: #fff;
    padding: 20rpx 30rpx;
    border-bottom: 1rpx solid #d9d9d9;
    .title-con{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .title{
      font-weight: bold;
    }
    .corp-name{
      color: $theme;
      padding: 20rpx 0 0 0;
    }
    .row{
      padding: 20rpx 0 0 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .col{
        display: flex;
        align-items: center;
        img{
          height: 35rpx;
          width: 35rpx;
          margin-right: 10rpx;
        }
      }
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
  .welfare{
    display: inline-block;
    padding: 10rpx 15rpx;
    border: 1rpx solid #d9d9d9;
    border-radius: 10rpx;
    margin: 10rpx 10rpx 0 0;
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
