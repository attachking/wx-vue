import Vue from 'vue'
import store from './store'
import App from './App.vue'
import base from './common/js/base'

Vue.use(base)
Vue.config.productionTip = false
// 将$store绑定到Vue的原型链上，才能正常使用{mapGetters, mapMutations, matActions}
Vue.prototype.$store = store
App.mpType = 'app'
const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [
      '^pages/tabs/index/main',
      'pages/tabs/preaching/main',
      'pages/tabs/jobFair/main',
      'pages/tabs/login/main',
      'pages/job/main'
    ],
    window: {
      backgroundTextStyle: 'light', // 下拉 loading 的样式，仅支持 dark/light
      navigationBarBackgroundColor: '#2a63b3', // 导航栏背景颜色，如"#000000"
      navigationBarTitleText: 'WeChat', // 标题
      navigationBarTextStyle: 'white', // 导航栏标题颜色，仅支持 black/white
      backgroundColor: '#f3f3f3', // 窗口的背景色
      onReachBottomDistance: 50 // 页面上拉触底事件触发时距页面底部距离，单位为px
    },
    tabBar: {
      color: '#333333',
      selectedColor: '#2a63b3',
      backgroundColor: '#f3f3f3',
      list: [{
        pagePath: 'pages/tabs/index/main',
        text: '最新机会',
        iconPath: 'static/img/tab-1.png',
        selectedIconPath: 'static/img/tab-1-ed.png'
      }, {
        pagePath: 'pages/tabs/preaching/main',
        text: '宣讲会',
        iconPath: 'static/img/tab-2.png',
        selectedIconPath: 'static/img/tab-2-ed.png'
      }, {
        pagePath: 'pages/tabs/jobFair/main',
        text: '招聘会',
        iconPath: 'static/img/tab-3.png',
        selectedIconPath: 'static/img/tab-3-ed.png'
      }]
    }
  }
}
