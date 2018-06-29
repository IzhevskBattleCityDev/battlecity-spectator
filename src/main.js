// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import axios from 'axios'
import App from './App'
import router from './router'
import Game from '@/classes/game.js'
Vue.use(Vuetify)
Vue.config.productionTip = false

const config = {
  // baseURL: 'http://epruizhw0172.moscow.epam.com:8080/codenjoy-contest',
  // baseWS: 'ws://epruizhw0172.moscow.epam.com:8080/codenjoy-contest',
  // baseURL: 'http://localhost:8080/codenjoy-contest',
  // baseWS: 'ws://localhost:8080/codenjoy-contest',
  // baseURL: 'http://10.27.11.34:8080/codenjoy-contest',
  // baseWS: 'ws://10.27.11.34:8080/codenjoy-contest',
  baseURL: 'http://212.158.174.142:8080/codenjoy-contest',
  baseWS: 'ws://212.158.174.142:8080/codenjoy-contest',
  contextPath: 'codenjoy-contest',
  timeout: 30000,
  name: 'bomberman'
}

// Setting up Axios on Vue Instance, for use via this.$axios
window.$http = Vue.$http = Vue.prototype.$http = axios.create(config)
// Default vars set up from localStorage (ie, user has come back)
// Vue.prototype.$axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('id_token')}`;
// Vue.prototype.$axios.defaults.headers.common['Access-Token'] = localStorage.getItem('auth_token');
/* eslint-disable no-new */

window.$game = Vue.$game = Vue.prototype.$game = new Game(config, axios.create(config))
window.$events = Vue.$events = Vue.prototype.$events = new Vue()

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  mounted () {
  }
})
