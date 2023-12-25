import LayerTianditu from "@/components/layers/LayerTianditu.vue"

export default [
  {
    path: '/layerModule',
    name: 'presets',
    component: LayerTianditu
  },
  {
    path: '/layerModule/tianditu',
    name: 'tianditu',
    component: LayerTianditu
  }
]