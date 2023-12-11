<template>
  <div id="presets-viewer">
    
  </div>
</template>

<script>
export default {
  mounted() {
    console.log(CesiumNicer.presets.viewer)
    new Cesium.Viewer("presets-viewer", {
      ...CesiumNicer.presets.viewer
    })
  }
}
</script>

<style scoped>
#presets-viewer {
  height: 500px;
  width: 400px;
}
</style>