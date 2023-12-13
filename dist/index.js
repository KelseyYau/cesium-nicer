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

var index$1 = {
  viewer
};

class BaseLayer {
  constructor(options) {
    this.name = options.name;
    this.id = options.id || Cesium.createGuid();
    this._alpha = 1;
  }
  get opacity() {
    return this._alpha;
  }
  set opacity(alpha) {
    if (this.layer) {
      this.layer.alpha = alpha;
    }
    this._alpha = alpha;
  }
  get visible() {
    if (this.layer) {
      return this.layer.show;
    } else {
      return false;
    }
  }
  set visible(show) {
    if (this.layer) {
      this.layer.show = show;
    }
  }
}

class TiandituLayer extends BaseLayer {
  constructor(options) {
    super(options);
    this._options = options;
    this._provider = this.initProvider(options);
    this.layerType = "TIANDITU";
  }
  initProvider(options) {
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
      maximumLevel: options.maximumLevel || 18,
      tilingScheme: new Cesium.WebMercatorTilingScheme()
    });
    return provider;
  }
  add(viewer) {
    if (!viewer)
      throw new Error("undefined viewer");
    this.layer = viewer.imageryLayers.addImageryProvider(this._provider);
    this.layer["id"] = this.id;
    return this.layer;
  }
  remove(viewer) {
    if (!viewer)
      throw new Error("undefined viewer");
    viewer.imageryLayers.remove(this.layer);
  }
}

var index = {
  TiandituLayer
};

export { index as layerModule, index$1 as presets };
