import Vue from 'vue'
import App from './App'
import store from './store/index.js'
import http from './common/http.js'
import config from './common/config.js'
Vue.config.productionTip = false

Vue.prototype.$currentVersion = config.version;

App.mpType = 'app'
Vue.prototype.$store=store;
Vue.prototype.$http=http;

uni.setStorageSync('tel','4006655231');

const app = new Vue({
    ...App
})
app.$mount();


