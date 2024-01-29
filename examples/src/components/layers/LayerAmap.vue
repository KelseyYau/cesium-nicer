<template>
  <div id="cesiumContainer">
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { CMap, layerModule, tilingScheme } from '../../../lib/index'
console.log(tilingScheme)
onMounted(() => {
  const map = new CMap('cesiumContainer', {})
  const amapLayer = new layerModule.AmapLayer({
    type: 'img',
  })
  amapLayer.add(map.viewer)
  map.viewer.camera.setView({ destination: Cesium.Cartesian3.fromDegrees(114.33598900442146,22.775838916286627,165215)})
  console.log(layerModule)
  const customArcGIS = layerModule.CustomArcGISImageryProvider.fromUrl('/arcgis/rest/services/shenzhen/MapServer')
  customArcGIS.then((provider: any) => {
    map.viewer.imageryLayers.addImageryProvider(provider)
  })
  console.log(map)
})

</script>

<style scoped>
#cesiumContainer {
  height: 100%;
  width: 100% ;
}
</style>