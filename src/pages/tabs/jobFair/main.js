import Vue from 'vue'
import App from './index.vue'

const app = new Vue(App)
app.$mount()
export default {
  config: {
    'navigationBarTitleText': '招聘会', // 导航栏标题文字内容
    'enablePullDownRefresh': false, // 是否开启下拉刷新
    'disableScroll': false // 设置为 true 则页面整体不能上下滚动；只在 page.json 中有效，无法在 app.json 中设置该项
  }
}
