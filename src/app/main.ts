import { createApp } from 'vue';
import App from './App.vue';

import '../shared/styles/main.css';
import {router} from "./router";
import {useLocale} from "../shared/composables/useLocale.ts";
import {useTheme} from "../shared/composables/useTheme.ts";
import {createPinia} from "pinia";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

useTheme();
useLocale();

app.mount('#app');