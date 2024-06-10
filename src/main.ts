import 'quasar/src/css/index.sass'; // Import Quasar css
import '@quasar/extras/material-icons/material-icons.css'; // Import icon libraries
import './css/style.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Quasar } from 'quasar';
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia()).use(router).use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
});

app.mount('#app');
