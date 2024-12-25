import { createApp } from 'vue'
import { createPinia } from 'pinia';
import { mapState, mapWritableState, mapStores } from 'pinia'
import router from "./router/index.js"
import { useDetailStore } from './store/detail.js'
import { useInfoStore } from './store/info.js'
import { useGlobalStore } from './store/global.js'
import { useDiscussStore } from './store/discuss.js'
import ElementPlus from 'element-plus'
import _ from "lodash"
import './style.css'
import App from './App.vue'
import 'element-plus/theme-chalk/src/index.scss';
const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount('#app');
app.use(ElementPlus)


window.detailStore = useDetailStore();
window.infoStore = useInfoStore();
window.globalStore = useGlobalStore();
window.discussStore = useDiscussStore();

// window.globalStore.logIn();
