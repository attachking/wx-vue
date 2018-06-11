<template>
  <div class="job-fair-detail">
    <div class="title">{{info.acb331}}</div>
    <div class="info">
      <div class="row">
        <img src="/static/img/position.png" alt="">
        <span>{{info.acd200name}}</span>
      </div>
      <div class="row">
        <img src="/static/img/time.png" alt="">
        <span>{{info.during}}</span>
      </div>
    </div>
    <div class="card">
      <div class="tit">
        <img src="/static/img/document.png" alt="">
        <span>招聘会详情</span>
      </div>
      <div class="card-con">
        <rich-txt :nodes="info.aae013"></rich-txt>
      </div>
    </div>
    <div class="card">
      <div class="tit">
        <img src="/static/img/corp.png" alt="">
        <span>参会企业</span>
      </div>
      <div class="card-con">
        <a class="item" v-for="(val, key) in list" :key="val.acb210" :href="'/pages/corporation/main?aab001=' + val.aab001">
          <div class="img">
            <image :src="val.ccmu15"></image>
          </div>
          <div class="con">
            <div class="pos-name">{{val.aab004}}</div>
            <div class="pos-mid">
              <div class="pos-info">
                <img src="/static/img/position.png" alt="">
                <div>{{val.aaa021}}</div>
              </div>
              <div class="pos-info">
                <img src="/static/img/corp.png" alt="">
                <div>{{val.aab019}}</div>
              </div>
            </div>
            <div class="pos-mid">
              <div class="pos-info">
                <img src="/static/img/field.png" alt="">
                <div>摊位号：{{val.ace201}}</div>
              </div>
              <div class="pos-info">
                <img src="/static/img/people.png" alt="">
                <div>发布职位数：{{val.cnt}}</div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
  import {listMixins} from '../../common/js/mixins'
  import {dateFormat, STATIC_URL} from '../../common/js/utils'
  import RichTxt from '../../components/rich-txt.vue'

  export default {
    components: {RichTxt},
    data() {
      return {
        search: {
          acb330: ''
        },
        info: {},
        searchData: {
          acb330: '',
          rowsNum: 10,
          currentPage: 1,
          aab004: ''
        },
        loading: false,
        pageBean: {},
        list: []
      }
    },
    ...listMixins,
    methods: {
      getDetail() {
        this.$loading.bar()
        this.$post('/service/business/college/jobfair/jobFairInfo/getJobFairInfo.xf', this.search).then(res => {
          this.$loading.barHide()
          res.data.result.during = `${dateFormat(res.data.result.acb333, 'yyyy-MM-dd hh:mm')} -- ${dateFormat(res.data.result.acb334, 'MM-dd hh:mm')}`
          this.info = res.data.result || {}
        }).catch(() => {
          this.$loading.barHide()
        })
      },
      getList() {
        if (this.loading) return
        this.loading = true
        this.$post('/service/business/college/jobfair/jobFairInfo/getJobFairCorpInfo', this.searchData).then(res => {
          this.loading = false
          this.pageBean = res.data.pageBean
          res.data.result.forEach(item => {
            item.ccmu15 = STATIC_URL + item.ccmu15
          })
          if (res.data.pageBean.currentPage === 1) {
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
      this.search.acb330 = this.$root.$mp.query.acb330
      this.searchData.acb330 = this.$root.$mp.query.acb330
      this.getDetail()
      this.getList()
    }
  }
</script>
<style lang="scss">
  @import "../../common/style/variables";

  .job-fair-detail{
    font-size: 28rpx;
    background: #f3f3f3;
  }
  .title{
    font-weight: bold;
    background: #fff;
    padding: 30rpx 20rpx;
    border-bottom: 1rpx solid #d9d9d9;
  }
  .info{
    padding: 20rpx 20rpx;
    margin: 15rpx 0;
    background: #fff;
    .row{
      display: flex;
      align-items: center;
      padding-bottom: 15rpx;
      img{
        width: 35rpx;
        height: 35rpx;
        margin-right: 10rpx;
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
  .item{
    padding: 20rpx 0;
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
      .pos-name{
        color: $theme;
        font-size: 32rpx;
        max-width: 350rpx;
        @include ellipsis;
      }
      .pos-mid{
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 28rpx;
        padding: 20rpx 0 0 0;
        .pos-info{
          display: flex;
          align-items: center;
          div{
            max-width: 250rpx;
            @include ellipsis;
          }
          img{
            width: 35rpx;
            height: 35rpx;
            margin-right: 10rpx;
          }
        }
      }
    }
  }
</style>
