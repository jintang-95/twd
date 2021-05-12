// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './assets/css/iconfont.css'
import './assets/iconfont/iconfont.css'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/table.css'
import mixin from './mixin/mixin'
import tableCmp from '@/components/table/index'
import config from '../config/config.js'
import permission from './permission.js'
import {
  message
} from '@/common/message.js';
import optiondata from '@/const/optiondata.js';
import echarts from 'echarts'

Vue.prototype.$echarts = echarts
Vue.prototype.$optiondata = optiondata
Vue.config.productionTip = false
Vue.use(ElementUi)
Vue.prototype.$message = message;
Vue.use(permission)
Vue.mixin(mixin)
Vue.use(tableCmp)
Vue.prototype.$config = config
Vue.prototype.$eventBus = new Vue();

router.beforeEach((to, from, next) => {
  let username = JSON.parse(sessionStorage.getItem('UserInfor'))
  let pageArr = to.matched.filter(item => item.meta.hasOwnProperty('title'))
  store.dispatch('setCrums', pageArr)
  if (username && username.UId) {
    next()
  } else {
    if (to.path === '/') { //这就是跳出循环的关键
      next()
    } else {
      next('/')
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
