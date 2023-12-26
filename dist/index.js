import gcoord from 'gcoord';

const viewerConfig = {
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
  viewerConfig
};

class CMap {
  constructor(id, options) {
    this._id = id;
    this._options = options;
    const viewOptions = {
      ...viewerConfig
    };
    this._viewer = new Cesium.Viewer(id, { ...viewOptions, baseLayer: false });
  }
  get viewer() {
    return this._viewer;
  }
}

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

class Gcj02TilingScheme extends Cesium.WebMercatorTilingScheme {
  constructor(options) {
    super(options);
    this._projection = null;
    this._projection = new Cesium.WebMercatorProjection(this.ellipsoid);
    const mercatorProjection = new Cesium.WebMercatorProjection(this.ellipsoid);
    this._projection.project = function(catographic, result) {
      const LngLat84 = [Cesium.Math.toDegrees(catographic.longitude), Cesium.Math.toDegrees(catographic.latitude)];
      const LngLatgcj02 = gcoord.transform(LngLat84, gcoord.WGS84, gcoord.GCJ02);
      const cartographicGcj02 = new Cesium.Cartographic(Cesium.Math.toRadians(LngLatgcj02[0]), Cesium.Math.toRadians(LngLatgcj02[1]));
      const mercator = mercatorProjection.project(cartographicGcj02, result);
      return new Cesium.Cartesian2(mercator.x, mercator.y);
    };
    this._projection.unproject = function(cartesian, result) {
      let cartographic84 = mercatorProjection.unproject(cartesian, result);
      let LngLatGcj02 = [Cesium.Math.toDegrees(cartographic84.longitude), Cesium.Math.toDegrees(cartographic84.latitude)];
      let LngLat84 = gcoord.transform(LngLatGcj02, gcoord.GCJ02, gcoord.WGS84);
      return new Cesium.Cartographic(Cesium.Math.toRadians(LngLat84[0]), Cesium.Math.toRadians(LngLat84[1]));
    };
  }
}

class AmapImageryProvider extends Cesium.UrlTemplateImageryProvider {
  constructor(options) {
    options["tilingScheme"] = new Gcj02TilingScheme({});
    super(options);
  }
}

const TILE_URL = {
  "img": "https://webst{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
  "vec": "http://webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
  "cva": "http://webst{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8"
};
class AmapLayer extends BaseLayer {
  constructor(options) {
    super(options);
    this._provider = this.initProvider(options);
    this._options = options;
    this.layerType = "AMAP";
  }
  initProvider(options) {
    const { type, url, minimumLevel, maximumLevel, subdomains } = options;
    const provider = new AmapImageryProvider({
      url: url || TILE_URL[type],
      minimumLevel: minimumLevel || 2,
      maximumLevel: maximumLevel || 18,
      subdomains: subdomains || ["01", "02", "03", "04"]
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
  TiandituLayer,
  AmapLayer
};

export { CMap, index as layerModule, index$1 as presets };
