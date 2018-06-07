<template>
  <div class="preaching">
    <div class="selects">
      <div class="select">
        <div class="multi-picker">
          <better-picker v-model="searchData.year" :list="years"></better-picker>
        </div>
        <image src="../../../static/img/arrow-down.png" class="arrow"></image>
      </div>
      <div class="select">
        <div class="multi-picker">
          <better-picker v-model="searchData.month" :list="months"></better-picker>
        </div>
        <image src="../../../static/img/arrow-down.png" class="arrow"></image>
      </div>
      <div class="select">
        <div class="multi-picker">
          <better-picker v-model="searchData.day" :list="days" placeholder="请选择日期" reset></better-picker>
        </div>
        <image src="../../../static/img/arrow-down.png" class="arrow"></image>
      </div>
    </div>
    <div class="list">
      <empty v-if="!loading && !list.length"></empty>
      <div class="item" v-for="(val, key) in list">
        <div class="left">
          <div class="left-item">
            <div>{{val.time1}}</div>
          </div>
          <div class="left-item">
            <div>{{val.time2}}</div>
          </div>
        </div>
        <div class="right">
          <div class="ct-tit">
            <div class="ct-title">{{val.ctTitle}}</div>
          </div>
          <div class="mid">
            <image src="/static/img/position.png"></image>
            <div>{{val.crAddress}}</div>
          </div>
          <div class="bot">
            <div class="during">
              <img src="/static/img/time.png">
              <div>{{val.start}} -- {{val.end}}</div>
            </div>
            <div class="tip" :class="val.tipCode === 1 ? 'red' : ''">{{val.tip}}</div>
          </div>
        </div>
      </div>
      <no-more v-if="list.length && !pageBean.hasNextPage"></no-more>
    </div>
  </div>
</template>
<script>
  import {listMixins} from '../../../common/js/mixins'
  import BetterPicker from '../../../components/better-picker.vue'
  import {dateFormat} from '../../../common/js/utils'
  import Empty from '../../../components/empty.vue'
  import NoMore from '../../../components/no-more.vue'

  const now = new Date()
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  export default {
    ...listMixins,
    components: {
      NoMore,
      Empty,
      BetterPicker},
    data() {
      return {
        years: [{
          id: now.getFullYear() - 1 + '',
          pid: '0',
          name: now.getFullYear() - 1 + '年'
        }, {
          id: now.getFullYear() + '',
          pid: '0',
          name: now.getFullYear() + '年'
        }, {
          id: now.getFullYear() + 1 + '',
          pid: '0',
          name: now.getFullYear() + 1 + '年'
        }],
        months: months.map((item, index) => {
          return {
            pid: '0',
            id: item + '',
            name: item + '月'
          }
        }),
        days: [],
        list: [],
        pageBean: {},
        searchData: {
          rowsNum: 10,
          year: now.getFullYear() + '',
          month: now.getMonth() + 1 + '',
          day: '',
          currentPage: 1,
          remark: 2 // remark为2时是本月今天以后的，remark为3时为确切日期的，为1时为本月所有的
        },
        searchCalendar: {
          remark: 0,
          year: now.getFullYear() + '',
          month: now.getMonth() + 1 + ''
        },
        loading: false
      }
    },
    methods: {
      getCalendar() {
        this.days = []
        this.$post('/service/business/college/jobfair/jobFairInfo/getCalendarInfo.xf', this.searchCalendar).then(res => {
          res.data.result.trList.forEach(item => {
            item.tdList.forEach(item => {
              if (item && item.careerList) {
                this.days.push({
                  pid: '0',
                  id: item.day + '',
                  name: `${item.day}日（${item.careerList.length}场）`
                })
              }
            })
          })
        })
      },
      getList() {
        if (this.loading) return
        const now = new Date()
        this.loading = true
        if (this.searchData.currentPage === 1) {
          this.$loading.bar()
        }
        this.$post('/service/business/college/careertalk/CareerTalkInfo/getCarrerTalkByTime.xf', this.searchData).then(res => {
          this.loading = false
          this.pageBean = res.data.pageBean
          res.data.result.forEach(item => {
            item.time1 = dateFormat(item.ctCareerStarttime, 'dd')
            item.time2 = dateFormat(item.ctCareerStarttime, 'yyyy-MM')
            item.start = dateFormat(item.ctCareerStarttime, 'hh:mm')
            item.end = dateFormat(item.ctCareerEndtime, 'hh:mm')
            if (dateFormat(item.ctCareerStarttime, 'yyyy-MM-dd') === dateFormat(now, 'yyyy-MM-dd')) {
              item.tipCode = 1
              item.tip = '今天'
            } else if (dateFormat(item.ctCareerStarttime, 'yyyy-MM-dd') === dateFormat(new Date(now.getTime() + (1000 * 60 * 60 * 24)), 'yyyy-MM-dd')) {
              item.tip = '明天'
            } else {
              item.tip = ''
            }
          })
          if (this.pageBean.currentPage === 1) {
            this.list = res.data.result
            this.$loading.barHide()
          } else {
            this.list = this.list.concat(res.data.result)
          }
        }).catch(() => {
          this.loading = false
        })
      }
    },
    created() {
      this.getCalendar()
      this.getList()
      this.$watch('searchData.year', (newVal) => {
        setTimeout(() => {
          this.searchData.currentPage = 1
          this.searchData.remark = 1
          this.searchData.day = ''
          this.searchCalendar.year = newVal
          this.getList()
          this.getCalendar()
        }, 20)
      })
      this.$watch('searchData.month', (newVal) => {
        setTimeout(() => {
          this.searchData.currentPage = 1
          this.searchData.remark = 1
          this.searchData.day = ''
          this.searchCalendar.month = newVal
          this.getList()
          this.getCalendar()
        }, 20)
      })
      this.$watch('searchData.day', (newVal) => {
        setTimeout(() => {
          this.searchData.currentPage = 1
          if (newVal) {
            this.searchData.remark = 3
          } else {
            this.searchData.remark = 1
          }
          this.getList()
        }, 20)
      })
    }
  }
</script>
<style lang="scss">
  @import "../../../common/style/variables";

  .selects{
    display: flex;
    font-size: 28rpx;
    padding: 15rpx 0;
    border-bottom: 1rpx solid #d9d9d9;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    .select{
      width: 33.3%;
      display: flex;
      align-items: center;
      justify-content: center;
      &:not(:last-child){
        border-right: 1rpx solid #d9d9d9;
      }
    }
    .multi-picker{
      max-width: 80%;
      @include ellipsis;
    }
    .arrow{
      width: 30rpx;
      height: 30rpx;
      margin-left: 10rpx;
    }
  }
  .list{
    padding-top: 79rpx;
  }
  .item{
    padding: 20rpx 20rpx;
    display: flex;
    align-items: center;
    &:not(:last-child){
      border-bottom: 1rpx dashed #d9d9d9;
    }
    .left{
      width: 120rpx;
      height: 120rpx;
      border: 1rpx solid #d9d9d9;
      border-radius: 5rpx;
      .left-item{
        height: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28rpx;
        &:not(:last-child){
          color: $theme;
          border-bottom: 1rpx solid #d9d9d9;
          font-size: 36rpx;
        }
        &:last-child{
          background: $theme-light;
          color: #fff;
        }
      }
    }
    .right{
      padding: 0 0 0 20rpx;
      box-sizing: border-box;
      height: 140rpx;
      flex-grow: 1;
      .ct-tit{
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 28rpx;
        .ct-title{
          max-width: 550rpx;
          @include ellipsis;
          font-weight: bold;
        }

      }
      .mid{
        font-size: 28rpx;
        @include ellipsis;
        padding: 15rpx 0;
        display: flex;
        align-items: center;
        image{
          width: 35rpx;
          height: 35rpx;
          margin-right: 10rpx;
        }
      }
      .bot{
        display: flex;
        font-size: 28rpx;
        align-items: center;
        justify-content: space-between;
        .during{
          display: flex;
          align-items: center;
          img{
            width: 35rpx;
            height: 35rpx;
            margin-right: 10rpx;
          }
        }
        .tip{
          color: #2a63b3;
        }
        .red{
          color: red;
        }
      }
    }
  }
</style>
