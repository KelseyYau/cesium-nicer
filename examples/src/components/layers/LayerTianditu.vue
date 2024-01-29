<template>
  <div id="cesiumContainer">
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { CMap, layerModule } from '../../../lib/index'

onMounted(() => {
  const map = new CMap('cesiumContainer', {})
  const tiandituLayer = new layerModule.TiandituLayer({
    type: 'img',
    tk: '42235c2540c0aa7d3e7630d9aa144ff5'
  })
  map.viewer.camera.setView({ destination: Cesium.Cartesian3.fromDegrees(114.33598900442146,22.775838916286627,165215)})
  tiandituLayer.add(map.viewer)
  const customArcGIS = layerModule.CustomArcGISImageryProvider.fromUrl('/arcgis/rest/services/shenzhen/MapServer')
  customArcGIS.then((provider: any) => {
    map.viewer.imageryLayers.addImageryProvider(provider)
  })
  const provider = new Cesium.GridImageryProvider({})
  map.viewer.imageryLayers.addImageryProvider(provider)
})

</script>

<style scoped>
#cesiumContainer {
  height: 100%;
  width: 100% ;
}
</style>