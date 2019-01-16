import Vue from 'vue';
import VueRouter from 'vue-router';
import router from './router';
import store from './vue-store';
import App from './../vue-components/App';
import './material-ui-init';
import './../scss/main.scss';

new Vue({
    el: '#MainAppContainer',
    router,
    store,
    template: '<router-view></router-view>',
    components: {App}
});