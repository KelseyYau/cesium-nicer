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
  tiandituLayer.add(map.viewer)
})

</script>

<style scoped>
#cesiumContainer {
  height: 100%;
  width: 100% ;
}
</style>