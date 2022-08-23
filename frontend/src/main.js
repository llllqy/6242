import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import _ from 'lodash'

Vue.prototype._ = _
Vue.config.productionTip = false
Vue.prototype.$axios = axios

// const routes = [
//   { path: '/', component: home },
//   { path: '/about', component: home },
// ]

// const router = VueRouter.createRouter({
//   // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
//   // history: VueRouter.createWebHashHistory(),
//   routes, // `routes: routes` 的缩写
// })
Vue.prototype.$axios = axios //全局注册，使用方法为:this.$axios

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')

// Vue.use(router);

