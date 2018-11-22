import Vue from 'vue';
import VueRouter from 'vue-router';
import router from './router';
import App from './../vue-components/App'
import './material-ui-init'
import './../scss/main.scss'

Vue.use(VueRouter);


new Vue({
    el: '#MainAppContainer',
    router: router,
    template: '<router-view></router-view>',
    components: { App }
});