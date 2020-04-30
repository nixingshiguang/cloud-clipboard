import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import websocket from './websocket';
import axios from 'axios';
import VueAxios from 'vue-axios';
import linkify from 'vue-linkify';

import {
    prettyFileSize,
    percentage,
    formatTimestamp,
} from './util';

import 'typeface-roboto/index.css';

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
Vue.directive('linkified', linkify);
Vue.filter('prettyFileSize', prettyFileSize);
Vue.filter('percentage', percentage);
Vue.filter('formatTimestamp', formatTimestamp);

new Vue({
    mixins: [websocket],
    data() {
        return {
            date: new Date,
            config: {
                version: '',
                text: {
                    limit: 0,
                },
                file: {
                    expire: 0,
                    chunk: 0,
                    limit: 0,
                },
            },
            send: {
                text: '',
                file: null,
            },
            received: [],
            device: [],
        };
    },
    router,
    vuetify,
    render: h => h(App),
    mounted() {
        setInterval(() => {this.date = new Date}, 1000);
    },
}).$mount('#app');