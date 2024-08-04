import Vue from 'vue'
import App from './App'
import uView from '@/uni_modules/uview-ui'
import api from '@/api/index'
import Md5 from "js-md5"
Vue.prototype.$md5 = Md5

Vue.use(uView);
Vue.config.productionTip = false
Vue.prototype.$api=api

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
