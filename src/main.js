import Vue from 'vue'
import App from './App.vue'
import router from './router'

// element-ui
import '@/utils/elementUi'
import 'element-ui/lib/theme-chalk/index.css' // elementUi CSS

// vuescroll
import vuescroll from 'vuescroll'
import vuescrollOption from './utils/vueScroll'
Vue.use(vuescroll, { ops: vuescrollOption })

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
