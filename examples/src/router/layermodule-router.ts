import LayerTianditu from "@/components/layers/LayerTianditu.vue"
import LayerAmap from "@/components/layers/LayerAmap.vue"

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
  },
  {
    path: '/layerModule/amap',
    name: 'tianditu',
    component: LayerAmap
  }
]