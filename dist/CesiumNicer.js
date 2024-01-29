(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('gcoord'), require('proj4')) :
  typeof define === 'function' && define.amd ? define(['gcoord', 'proj4'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.CesiumNicer = factory(global.gcoord, global.proj4));
})(this, (function (gcoord, proj4) { 'use strict';

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

  var presets = {
    viewerConfig
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

  const proj4Datas = [
    {
      code: "4547",
      proj4: "+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs",
      name: "CGCS2000 / 3-degree Gauss-Kruger CM 114E"
    },
    {
      code: "4550",
      proj4: "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs",
      name: "CGCS2000 / 3-degree Gauss-Kruger CM 123E"
    }
  ];
  const getProjData4ByCode = (code) => {
    const data = proj4Datas.find((item) => {
      return item.code == code;
    });
    return data;
  };

  const WGS84_PROJ4 = "+proj=longlat +datum=WGS84 +no_defs +type=crs";
  class GuassProjection extends Cesium.WebMercatorProjection {
    constructor(options) {
      super(options);
      this._ellipsoid = null;
      this._semimajorAxis = null;
      this._oneOverSemimajorAxis = null;
      this._epsgCode = null;
      this._pro4Str = null;
      this._ellipsoid = Cesium.defaultValue(options.ellisoid, Cesium.Ellipsoid.WGS84);
      this._semimajorAxis = this._ellipsoid.maximumRadius;
      this._oneOverSemimajorAxis = 1 / this._semimajorAxis;
      this._epsgCode = options.epsgCode;
      this._pro4Str = getProjData4ByCode(this._epsgCode).proj4 || options.proj4Str || "";
    }
    project(cartographic, result) {
      const lng = cartographic.longitude;
      const lat = cartographic.latitude;
      const dlng = Cesium.Math.toDegrees(lng);
      const dlat = Cesium.Math.toDegrees(lat);
      const gaussXY = proj4(this._pro4Str, [dlng, dlat]);
      const [x, y] = gaussXY;
      const z = cartographic.height;
      if (!Cesium.defined(result)) {
        return new Cesium.Cartesian3(x, y, z);
      }
      result.x = x;
      result.y = y;
      result.z = z;
      return result;
    }
    unproject(cartesian, result) {
      if (!Cesium.defined(cartesian)) {
        throw new Cesium.DeveloperError("cartesian is required");
      }
      const [x, y] = [cartesian.x, cartesian.y];
      const lnglat = proj4(this._pro4Str, WGS84_PROJ4, [x, y]);
      const lng = Cesium.Math.toRadians(lnglat[0]);
      const lat = Cesium.Math.toRadians(lnglat[1]);
      const height = cartesian.z;
      if (!Cesium.defined(result)) {
        return new Cesium.Cartographic(lng, lat, height);
      }
      result.longitude = lng;
      result.latitude = lat;
      result.height = height;
      return result;
    }
  }

  class GaussProjectTilingScheme extends Cesium.WebMercatorTilingScheme {
    constructor(options) {
      super(options);
      this._resolutions = [];
      this._origin = [];
      this._extent = [];
      this._epsgCode = null;
      this._tileSize = 256;
      this._projection = new GuassProjection({ epsgCode: options.epsgCode });
      this._epsgCode = options.epsgCode;
      this._origin = options.origin;
      this._resolutions = options.resolutions || [];
      this._extent = options.extent;
      this._rectangleSouthwestInMeters = new Cesium.Cartesian2(
        this._extent[0],
        this._extent[1]
      );
      this._rectangleNortheastInMeters = new Cesium.Cartesian2(
        this._extent[2],
        this._extent[3]
      );
      const southwest = this._projection.unproject(this._rectangleSouthwestInMeters);
      const northeast = this._projection.unproject(this._rectangleNortheastInMeters);
      this._rectangle = new Cesium.Rectangle(
        southwest.longitude,
        southwest.latitude,
        northeast.longitude,
        northeast.latitude
      );
      this.initZeroTilesXY();
    }
    initZeroTilesXY() {
      const zeroResolutions = this._resolutions[0];
      const lefttopX = Math.floor(Math.abs(this._origin[0] - this._extent[0]) / (zeroResolutions * this._tileSize));
      const lefttopY = Math.floor(Math.abs(this._origin[1] - this._extent[3]) / (zeroResolutions * this._tileSize));
      const rightBottomX = Math.floor(Math.abs(this._origin[0] - this._extent[2]) / (zeroResolutions * this._tileSize));
      const rightBottomY = Math.floor(Math.abs(this._origin[1] - this._extent[1]) / (zeroResolutions * this._tileSize));
      this._numberOfLevelZeroTilesX = Math.abs(rightBottomX - lefttopX) + 1;
      this._numberOfLevelZeroTilesY = Math.abs(lefttopY - rightBottomY) + 1;
    }
    rectangleToNativeRectangle(rectangle, result) {
      const projection = this._projection;
      const southwest = projection.project(Cesium.Rectangle.southwest(rectangle));
      const northeast = projection.project(Cesium.Rectangle.northeast(rectangle));
      if (!Cesium.defined(result)) {
        return new Cesium.Rectangle(southwest.x, southwest.y, northeast.x, northeast.y);
      }
      result.west = southwest.x;
      result.south = southwest.y;
      result.east = northeast.x;
      result.north = northeast.y;
      return result;
    }
    tileXYToNativeRectangle(x, y, level, result) {
      const xTiles = this.getNumberOfXTilesAtLevel(level);
      const yTiles = this.getNumberOfYTilesAtLevel(level);
      const resolution = this._resolutions[level];
      const lefttopX = Math.floor(Math.abs(this._origin[0] - this._extent[0]) / (resolution * this._tileSize));
      const lefttopY = Math.floor(Math.abs(this._origin[1] - this._extent[3]) / (resolution * this._tileSize));
      const xTileWidth = (this._rectangleNortheastInMeters.x - this._rectangleSouthwestInMeters.x) / xTiles;
      const startX = x - lefttopX;
      const startY = y - lefttopY;
      const west = this._rectangleSouthwestInMeters.x + startX * xTileWidth;
      const east = this._rectangleSouthwestInMeters.x + (startX + 1) * xTileWidth;
      const yTileHeight = (this._rectangleNortheastInMeters.y - this._rectangleSouthwestInMeters.y) / yTiles;
      const north = this._rectangleNortheastInMeters.y - startY * yTileHeight;
      const south = this._rectangleNortheastInMeters.y - (startY + 1) * yTileHeight;
      if (!Cesium.defined(result)) {
        return new Cesium.Rectangle(west, south, east, north);
      }
      result.west = west;
      result.south = south;
      result.east = east;
      result.north = north;
      return result;
    }
    tileXYToRectangle(x, y, level, result) {
      const nativeRectangle = this.tileXYToNativeRectangle(x, y, level, result);
      const projection = this._projection;
      const southwest = projection.unproject(
        new Cesium.Cartesian3(nativeRectangle.west, nativeRectangle.south)
      );
      const northeast = projection.unproject(
        new Cesium.Cartesian3(nativeRectangle.east, nativeRectangle.north)
      );
      nativeRectangle.west = southwest.longitude;
      nativeRectangle.south = southwest.latitude;
      nativeRectangle.east = northeast.longitude;
      nativeRectangle.north = northeast.latitude;
      return nativeRectangle;
    }
    positionToTileXY(position, level, result) {
      const rectangle = this._rectangle;
      if (!Cesium.Rectangle.contains(rectangle, position)) {
        return void 0;
      }
      const resolution = this._resolutions[level];
      const lefttopX = Math.floor(Math.abs(this._origin[0] - this._extent[0]) / (resolution * this._tileSize));
      const lefttopY = Math.floor(Math.abs(this._origin[1] - this._extent[3]) / (resolution * this._tileSize));
      const xTiles = this.getNumberOfXTilesAtLevel(level);
      const yTiles = this.getNumberOfYTilesAtLevel(level);
      const overallWidth = this._rectangleNortheastInMeters.x - this._rectangleSouthwestInMeters.x;
      const xTileWidth = overallWidth / xTiles;
      const overallHeight = this._rectangleNortheastInMeters.y - this._rectangleSouthwestInMeters.y;
      const yTileHeight = overallHeight / yTiles;
      const projection = this._projection;
      const gaussPosition = projection.project(position);
      const distanceFromWest = gaussPosition.x - this._rectangleSouthwestInMeters.x;
      const distanceFromNorth = this._rectangleNortheastInMeters.y - gaussPosition.y;
      let xTileCoordinate = distanceFromWest / xTileWidth | 0;
      if (xTileCoordinate >= xTiles) {
        xTileCoordinate = xTiles - 1;
      }
      let yTileCoordinate = distanceFromNorth / yTileHeight | 0;
      if (yTileCoordinate >= yTiles) {
        yTileCoordinate = yTiles - 1;
      }
      xTileCoordinate = xTileCoordinate + lefttopX;
      yTileCoordinate = yTileCoordinate + lefttopY;
      if (!Cesium.defined(result)) {
        return new Cesium.Cartesian2(xTileCoordinate, yTileCoordinate);
      }
      result.x = xTileCoordinate;
      result.y = yTileCoordinate;
      return result;
    }
  }

  class CustomArcGISImageryProvider extends Cesium.ArcGisMapServerImageryProvider {
    constructor(options) {
      super(options);
      this._resource = null;
    }
    static async fromUrl(url, options) {
      options = Cesium.defaultValue(options, {});
      const resource = new Cesium.Resource({ url });
      resource.appendForwardSlash();
      if (Cesium.defined(options.token)) {
        resource.setQueryParameters({
          token: options.token
        });
      }
      const provider = new CustomArcGISImageryProvider(options);
      provider._resource = resource;
      const imageryProviderBuilder = new ImageryProviderBuilder(options);
      const useTiles = Cesium.defaultValue(options.usePreCachedTilesIfAvailable, true);
      if (useTiles) {
        await requestMetadata(resource, imageryProviderBuilder);
      }
      imageryProviderBuilder.build(provider);
      return provider;
    }
    requestImage(x, y, level, request) {
      return Cesium.ImageryProvider.loadImage(
        this,
        buildImageResource(this, x, y, level, request)
      );
    }
  }
  async function requestMetadata(resource, imageryProviderBuilder) {
    const jsonResource = resource.getDerivedResource({
      queryParameters: {
        f: "json"
      }
    });
    try {
      const data = await jsonResource.fetchJson();
      metadataSuccess(data, imageryProviderBuilder);
    } catch (error) {
      metadataFailure(resource, error);
    }
  }
  function metadataSuccess(data, imageryProviderBuilder) {
    const tileInfo = data.tileInfo;
    const resolutions = tileInfo["lods"].map((item) => item.resolution);
    const origin = [tileInfo["origin"]["x"], tileInfo["origin"]["y"]];
    const fullExtent = data.fullExtent;
    const extent = [fullExtent["xmin"], fullExtent["ymin"], fullExtent["xmax"], fullExtent["ymax"]];
    const wkid = tileInfo.spatialReference.wkid;
    if (!Cesium.defined(tileInfo)) {
      imageryProviderBuilder.useTiles = false;
    } else {
      imageryProviderBuilder.tileWidth = tileInfo.rows;
      imageryProviderBuilder.tileHeight = tileInfo.cols;
      if (wkid === 102100 || wkid === 102113) {
        imageryProviderBuilder.tilingScheme = new Cesium.WebMercatorTilingScheme({
          ellipsoid: imageryProviderBuilder.ellipsoid
        });
      } else if (wkid === 4326) {
        imageryProviderBuilder.tilingScheme = new Cesium.GeographicTilingScheme({
          ellipsoid: imageryProviderBuilder.ellipsoid
        });
      } else if (wkid > 4512 && wkid < 4554) {
        imageryProviderBuilder.tilingScheme = new GaussProjectTilingScheme({
          epsgCode: wkid,
          resolutions,
          origin,
          extent
        });
      } else {
        const message = `Tile spatial reference WKID ${wkid} is not supported.`;
        throw new Cesium.RuntimeError(message);
      }
      imageryProviderBuilder.maximumLevel = data.tileInfo.lods.length - 1;
      if (Cesium.defined(data.fullExtent)) {
        if (Cesium.defined(data.fullExtent.spatialReference) && Cesium.defined(data.fullExtent.spatialReference.wkid)) {
          if (data.fullExtent.spatialReference.wkid === 102100 || data.fullExtent.spatialReference.wkid === 102113) {
            const projection = new Cesium.WebMercatorProjection();
            const extent2 = data.fullExtent;
            const sw = projection.unproject(
              new Cesium.Cartesian3(
                Math.max(
                  extent2.xmin,
                  -imageryProviderBuilder.tilingScheme.ellipsoid.maximumRadius * Math.PI
                ),
                Math.max(
                  extent2.ymin,
                  -imageryProviderBuilder.tilingScheme.ellipsoid.maximumRadius * Math.PI
                ),
                0
              )
            );
            const ne = projection.unproject(
              new Cesium.Cartesian3(
                Math.min(
                  extent2.xmax,
                  imageryProviderBuilder.tilingScheme.ellipsoid.maximumRadius * Math.PI
                ),
                Math.min(
                  extent2.ymax,
                  imageryProviderBuilder.tilingScheme.ellipsoid.maximumRadius * Math.PI
                ),
                0
              )
            );
            imageryProviderBuilder.rectangle = new Cesium.Rectangle(
              sw.longitude,
              sw.latitude,
              ne.longitude,
              ne.latitude
            );
          } else if (data.fullExtent.spatialReference.wkid === 4326) {
            imageryProviderBuilder.rectangle = Cesium.Rectangle.fromDegrees(
              data.fullExtent.xmin,
              data.fullExtent.ymin,
              data.fullExtent.xmax,
              data.fullExtent.ymax
            );
          } else if (data.fullExtent.spatialReference.wkid > 4512 && data.fullExtent.spatialReference.wkid < 4554) {
            const projection = new GuassProjection({ epsgCode: data.fullExtent.spatialReference.wkid });
            const extent2 = data.fullExtent;
            const sw = projection.unproject(
              new Cesium.Cartesian3(
                extent2["xmin"],
                extent2.ymin,
                0
              )
            );
            const ne = projection.unproject(
              new Cesium.Cartesian3(
                extent2.xmax,
                extent2.ymax,
                0
              )
            );
            imageryProviderBuilder.rectangle = new Cesium.Rectangle(
              sw.longitude,
              sw.latitude,
              ne.longitude,
              ne.latitude
            );
          } else {
            const extentMessage = `fullExtent.spatialReference WKID ${data.fullExtent.spatialReference.wkid} is not supported.`;
            throw new Cesium.RuntimeError(extentMessage);
          }
        }
      } else {
        imageryProviderBuilder.rectangle = imageryProviderBuilder.tilingScheme.rectangle;
      }
      imageryProviderBuilder.useTiles = true;
    }
    if (Cesium.defined(data.copyrightText) && data.copyrightText.length > 0) {
      if (Cesium.defined(imageryProviderBuilder.credit)) {
        imageryProviderBuilder.tileCredits = [new Cesium.Credit(data.copyrightText)];
      } else {
        imageryProviderBuilder.credit = new Cesium.Credit(data.copyrightText);
      }
    }
  }
  function metadataFailure(resource, error) {
    let message = `An error occurred while accessing ${resource.url}`;
    if (Cesium.defined(error) && Cesium.defined(error.message)) {
      message += `: ${error.message}`;
    }
    throw new Cesium.RuntimeError(message);
  }
  function buildImageResource(imageryProvider, x, y, level, request) {
    let resource;
    if (imageryProvider._useTiles) {
      resource = imageryProvider._resource.getDerivedResource({
        url: `tile/${level}/${y}/${x}`,
        request
      });
    } else {
      const nativeRectangle = imageryProvider._tilingScheme.tileXYToNativeRectangle(
        x,
        y,
        level
      );
      const bbox = `${nativeRectangle.west},${nativeRectangle.south},${nativeRectangle.east},${nativeRectangle.north}`;
      const query = {
        bbox,
        size: `${imageryProvider._tileWidth},${imageryProvider._tileHeight}`,
        format: "png32",
        transparent: true,
        f: "image",
        bboxSR: 4326,
        imageSR: 4326,
        layers: ""
      };
      if (imageryProvider._tilingScheme.projection instanceof Cesium.GeographicProjection) {
        query.bboxSR = 4326;
        query.imageSR = 4326;
      } else {
        query.bboxSR = 3857;
        query.imageSR = 3857;
      }
      if (imageryProvider.layers) {
        query.layers = `show:${imageryProvider.layers}`;
      }
      resource = imageryProvider._resource.getDerivedResource({
        url: "export",
        request,
        queryParameters: query
      });
    }
    return resource;
  }
  class ImageryProviderBuilder {
    constructor(options) {
      this.useTiles = null;
      this.tilingScheme = null;
      this.rectangle = null;
      this.ellipsoid = null;
      this.credit = null;
      this.tileCredits = null;
      this.tileDiscardPolicy = null;
      this.tileWidth = null;
      this.tileHeight = null;
      this.maximumLevel = null;
      this.useTiles = Cesium.defaultValue(options.usePreCachedTilesIfAvailable, true);
      const ellipsoid = options.ellipsoid;
      this.tilingScheme = Cesium.defaultValue(
        options.tilingScheme,
        new Cesium.GeographicTilingScheme({ ellipsoid })
      );
      this.rectangle = Cesium.defaultValue(options.rectangle, this.tilingScheme.rectangle);
      this.ellipsoid = ellipsoid;
      let credit = options.credit;
      if (typeof credit === "string") {
        credit = new Cesium.Credit(credit);
      }
      this.credit = credit;
      this.tileCredits = void 0;
      this.tileDiscardPolicy = options.tileDiscardPolicy;
      this.tileWidth = Cesium.defaultValue(options.tileWidth, 256);
      this.tileHeight = Cesium.defaultValue(options.tileHeight, 256);
      this.maximumLevel = options.maximumLevel;
    }
    build(provider) {
      provider._useTiles = this.useTiles;
      provider._tilingScheme = this.tilingScheme;
      provider._rectangle = this.rectangle;
      provider._credit = this.credit;
      provider._tileCredits = this.tileCredits;
      provider._tileDiscardPolicy = this.tileDiscardPolicy;
      provider._tileWidth = this.tileWidth;
      provider._tileHeight = this.tileHeight;
      provider._maximumLevel = this.maximumLevel;
      if (this.useTiles && !Cesium.defined(this.tileDiscardPolicy)) {
        provider._tileDiscardPolicy = new Cesium.DiscardMissingTileImagePolicy({
          missingImageUrl: buildImageResource(provider, 0, 0, this.maximumLevel).url,
          pixelsToCheck: [
            new Cesium.Cartesian2(0, 0),
            new Cesium.Cartesian2(200, 20),
            new Cesium.Cartesian2(20, 200),
            new Cesium.Cartesian2(80, 110),
            new Cesium.Cartesian2(160, 130)
          ],
          disableCheckIfAllPixelsAreTransparent: true
        });
      }
    }
  }

  var layerModule = {
    TiandituLayer,
    AmapLayer,
    CustomArcGISImageryProvider
  };

  var tilingScheme = { GaussProjectTilingScheme, Gcj02TilingScheme };

  let CesiumNicer = {
    presets,
    layerModule,
    tilingScheme
  };

  return CesiumNicer;

}));
