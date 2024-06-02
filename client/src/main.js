import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'

import './style.css'
import App from './App.vue'

import router from './router'
import store from "./store"

const vuetify = createVuetify({
    components
})

createApp(App).use(vuetify).use(router).use(store).mount('#app')
