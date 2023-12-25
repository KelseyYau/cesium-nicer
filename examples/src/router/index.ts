import { createRouter, createWebHashHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import presetsRouter from './presets-router'
import layermoduleRouter from './layermodule-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    ...presetsRouter,
    ...layermoduleRouter
  ]
})

export default router
