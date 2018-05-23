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
      '^pages/index/main',
      'pages/logs/main',
      'pages/login/main'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }
}
