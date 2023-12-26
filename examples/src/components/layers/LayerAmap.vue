<template>
  <div id="cesiumContainer">
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { CMap, layerModule } from '../../../lib/index'

onMounted(() => {
  const map = new CMap('cesiumContainer', {})
  const amapLayer = new layerModule.AmapLayer({
    type: 'img',
  })
  amapLayer.add(map.viewer)
})

</script>

<style scoped>
#cesiumContainer {
  height: 100%;
  width: 100% ;
}
</style>