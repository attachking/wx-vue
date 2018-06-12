<template>
  <div class="corporation">
    <div class="title">
      <div class="left">
        <img :src="info.ccmu15" alt="">
      </div>
      <div class="right">
        <div class="corp-name">{{info.aab004}}</div>
        <div class="corp-info">
          <div class="corp-info-item">
            <img src="/static/img/field.png" alt="">
            <div>{{info.ccpr10name}}</div>
          </div>
        </div>
        <div class="corp-info">
          <div class="corp-info-item">
            <img src="/static/img/corp.png" alt="">
            <div>{{info.aab019name}}</div>
          </div>
          <div class="corp-info-item">
            <img src="/static/img/people.png" alt="">
            <div>{{info.aab056name}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="map">
        <img src="/static/img/position.png" alt="">
        <div>{{info.aaa021}}</div>
        <div v-if="info.cabq03">（{{info.aae006}}）</div>
        <div class="corp-info-item show-map" v-if="info.cabq03" @click="renderMap">查看地图</div>
    </div>
    <div class="card">
      <div class="tit">
        <img src="/static/img/document.png" alt="">
        <div>单位简介</div>
      </div>
      <div class="card-con">
        <rich-txt :nodes="info.acb206"></rich-txt>
      </div>
    </div>
    <div class="card">
      <div class="tit">
        <img src="/static/img/message.png" alt="">
        <div>联系我们</div>
      </div>
      <div class="card-con">
        <div class="contact-us">网址：{{info.aae016 || '--'}}</div>
        <div class="contact-us">联系人：{{info.aae004 || '--'}}</div>
        <div class="contact-us" @click="tel(info.aae005)">电话：{{info.aae005 || '--'}}</div>
        <div class="contact-us">邮箱：{{info.aae015 || '--'}}</div>
      </div>
    </div>
    <div class="card">
      <div class="tit">
        <img src="/static/img/tools.png" alt="">
        <div>在招职位</div>
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
        <no-more v-if="!pageBean.hasNextPage && list.length"></no-more>
      </div>
    </div>
  </div>
</template>
<script>
  import {STATIC_URL, dateFormat} from '../../common/js/utils'
  import {normalMixins, listMixins} from '../../common/js/mixins'
  import Empty from '../../components/empty.vue'
  import NoMore from '../../components/no-more.vue'
  import RichTxt from '../../components/rich-txt.vue'

  export default {
    components: {
      RichTxt,
      NoMore,
      Empty},
    data() {
      return {
        info: {},
        loading: false,
        searchData: {
          aab001: '',
          rowsNum: 10,
          currentPage: 1
        },
        pageBean: {},
        list: []
      }
    },
    methods: {
      ...listMixins,
      ...normalMixins,
      getDetail(aab001) {
        this.$loading.bar()
        this.$post('/service/business/college/corp/corps/getCorpDetail.xf', {aab001}).then(res => {
          this.$loading.barHide()
          res.data.result.corpInfo.ccmu15 = STATIC_URL + res.data.result.corpInfo.ccmu15
          this.info = res.data.result.corpInfo
        }).catch(() => {
          this.$loading.barHide()
        })
      },
      renderMap() {
        this.showMap({
          latitude: this.info.cabq03, // 纬度
          longitude: this.info.cabq02, // 经度
          address: this.info.aae006,
          name: this.info.aab004
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
      this.getDetail(this.$root.$mp.query.aab001)
      this.searchData.aab001 = this.$root.$mp.query.aab001
      this.getList()
    }
  }
</script>
<style lang="scss">
  @import "../../common/style/variables";

  .corporation{
    background: #f3f3f3;
    font-size: 28rpx;
    .title{
      padding: 20rpx 20rpx;
      border-bottom: 1rpx solid #d9d9d9;
      display: flex;
      align-items: center;
      background: #fff;
      .left{
        width: 150rpx;
        height: 150rpx;
        img{
          height: 100%;
          width: 100%;
        }
      }
      .right{
        flex-grow: 1;
        padding: 0 0 0 10rpx;
        .corp-name{
          font-weight: bold;
        }
        .corp-info{
          padding: 15rpx 0 0 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .corp-info-item{
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
    }
    .map{
      padding: 20rpx 20rpx;
      background: #fff;
      display: flex;
      flex-wrap: wrap;
      margin: 15rpx 0;
      img{
        height: 35rpx;
        width: 35rpx;
        margin-right: 10rpx;
      }
    }
    .show-map{
      color: #0093dd;
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
    .contact-us{
      padding: 10rpx 0;
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
