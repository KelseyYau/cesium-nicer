<template>
  <div id="presets-viewer"></div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { CMap } from '../../../lib/index'

onMounted(() => {
  const viewer = new CMap('presets-viewer', {})
  console.log(viewer)
})

</script>

<style scoped>
#presets-viewer {
  height: 100%;
  width: 100% ;
}
</style>