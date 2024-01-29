// import LayerTianditu from "@/components/layers/LayerTianditu.vue"
// import LayerAmap from "@/components/layers/LayerAmap.vue"

export default [
  {
    path: '/layerModule',
    name: '',
    component: () => import("@/components/layers/LayerTianditu.vue")
  },
  {
    path: '/layerModule/tianditu',
    name: 'tianditu',
    component: () => import("@/components/layers/LayerTianditu.vue")
  },
  {
    path: '/layerModule/amap',
    name: 'amap',
    component: () => import("@/components/layers/LayerAmap.vue")
  }
]