// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Mint from 'mint-ui'
import axios from 'axios'
import 'lib-flexible'
import '../static/css/main.css'
import md5 from 'js-md5'
import 'mint-ui/lib/style.css';

Vue.prototype.$axios = axios
import { Swipe, SwipeItem } from "mint-ui";
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);

Vue.prototype.$md5 = md5
Vue.config.productionTip = false
// Vue.prototype.$BScroll = BScroll

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})