<template>
  <div id="presets-viewer">
  </div>
</template>

<script>
export default {
  mounted() {
    setTimeout(() => {
      const viewer = new Cesium.Viewer("presets-viewer", {
        ...CesiumNicer.presets.viewer
      })
      const tiandituLayer = new CesiumNicer.layerModule.TiandituLayer({
        type: 'img',
        tk: '42235c2540c0aa7d3e7630d9aa144ff5'
      })
      console.log(tiandituLayer)
      tiandituLayer.add(viewer)
    }, 300);
  }
}
</script>

<style scoped>
#presets-viewer {
  height: 500px;
  width: 400px;
}
</style>