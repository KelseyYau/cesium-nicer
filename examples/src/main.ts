import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import {
  ElButton,
  ElContainer,
  ElHeader,
  ElAside,
  ElMain
} from 'element-plus'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(ElButton)
app.use(ElContainer)
app.use(ElHeader)
app.use(ElAside)
app.use(ElMain)

app.mount('#cesium-nicer')
