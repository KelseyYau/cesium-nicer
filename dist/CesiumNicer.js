(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.CesiumNicer = factory());
})(this, (function () { 'use strict';

  var viewer = {
    animation: false,
    baseLayerPicker: false,
    fullscreenButton: false,
    vrButton: false,
    geocoder: false,
    homeButton: false,
    InfoBox: false,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    navigationHelpButton: false,
    baseLayer: false
  };

  var presets = {
    viewer
  };

  class TiandituLayer {
    constructor(options) {
      this._options = options;
      this._provider = this.initProvider(options);
    }
    initProvider(options) {
      this.id = options.id || Cesium.createGuid();
      const type = options.type || "img";
      const tileMatrix = "w";
      const defaultSubdomains = ["0", "1", "2", "3", "4", "5", "6", "7"];
      const provider = new Cesium.WebMapTileServiceImageryProvider({
        url: options.url || `http://t{s}.tianditu.gov.cn/${type}_w/wmts?tk=${options.tk}`,
        layer: type,
        format: "tiles",
        style: "default",
        tileMatrixSetID: tileMatrix,
        subdomains: defaultSubdomains,
        maximumLevel: 18,
        tilingScheme: new Cesium.WebMercatorTilingScheme()
      });
      return provider;
    }
    add(viewer) {
      if (!viewer)
        throw new Error("undefined viewer");
      this._layer = viewer.imageryLayers.addImageryProvider(this._provider);
      return this._layer;
    }
    remove(viewer) {
      if (!viewer)
        throw new Error("undefined viewer");
      viewer.imageryLayers.remove(this._layer);
    }
  }

  var layerModule = {
    TiandituLayer
  };

  let CesiumNicer = {
    presets,
    layerModule
  };

  return CesiumNicer;

}));
