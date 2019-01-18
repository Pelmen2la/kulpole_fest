import Vue from 'vue';
import router from './router';
import store from './app-store';
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