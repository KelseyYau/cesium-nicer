import GuassProjection from "../../projection/GuassProjection";
import GaussProjectTilingScheme from "../../tilingScheme/GaussProjectTilingScheme";

export default class CustomArcGISImageryProvider extends Cesium.ArcGisMapServerImageryProvider {
  _resource = null

  constructor(options) {
    super(options)
  }

  static async fromUrl(url: string, options) {
    //>>includeEnd('debug');
  
    options = Cesium.defaultValue(options, {});
  
    const resource = new Cesium.Resource({url});
    resource.appendForwardSlash();
  
    if (Cesium.defined(options.token)) {
      resource.setQueryParameters({
        token: options.token,
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

  requestImage(
    x,
    y,
    level,
    request
  ) {
    return Cesium.ImageryProvider.loadImage(
      this,
      buildImageResource(this, x, y, level, request)
    );
  };
  
}

async function requestMetadata(resource, imageryProviderBuilder) {
  const jsonResource = resource.getDerivedResource({
    queryParameters: {
      f: "json",
    },
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
  const resolutions = tileInfo['lods'].map(item => item.resolution)
  const origin = [tileInfo['origin']['x'], tileInfo['origin']['y']]
  const fullExtent = data.fullExtent
  const extent = [fullExtent['xmin'], fullExtent['ymin'], fullExtent['xmax'], fullExtent['ymax']]
  const wkid = tileInfo.spatialReference.wkid
  if (!Cesium.defined(tileInfo)) {
    imageryProviderBuilder.useTiles = false;
  } else {
    imageryProviderBuilder.tileWidth = tileInfo.rows;
    imageryProviderBuilder.tileHeight = tileInfo.cols;
    if (
      wkid === 102100 ||
      wkid === 102113
    ) {
      imageryProviderBuilder.tilingScheme = new Cesium.WebMercatorTilingScheme({
        ellipsoid: imageryProviderBuilder.ellipsoid,
      });
    } else if (wkid === 4326) {
      imageryProviderBuilder.tilingScheme = new Cesium.GeographicTilingScheme({
        ellipsoid: imageryProviderBuilder.ellipsoid,
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
      if (
        Cesium.defined(data.fullExtent.spatialReference) &&
        Cesium.defined(data.fullExtent.spatialReference.wkid)
      ) {
        if (
          data.fullExtent.spatialReference.wkid === 102100 ||
          data.fullExtent.spatialReference.wkid === 102113
        ) {
          const projection = new Cesium.WebMercatorProjection();
          const extent = data.fullExtent;
          const sw = projection.unproject(
            new Cesium.Cartesian3(
              Math.max(
                extent.xmin,
                -imageryProviderBuilder.tilingScheme.ellipsoid.maximumRadius *
                  Math.PI
              ),
              Math.max(
                extent.ymin,
                -imageryProviderBuilder.tilingScheme.ellipsoid.maximumRadius *
                  Math.PI
              ),
              0.0
            )
          );
          const ne = projection.unproject(
            new Cesium.Cartesian3(
              Math.min(
                extent.xmax,
                imageryProviderBuilder.tilingScheme.ellipsoid.maximumRadius *
                  Math.PI
              ),
              Math.min(
                extent.ymax,
                imageryProviderBuilder.tilingScheme.ellipsoid.maximumRadius *
                  Math.PI
              ),
              0.0
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
        } else if(data.fullExtent.spatialReference.wkid > 4512 && data.fullExtent.spatialReference.wkid < 4554) {
          const projection = new GuassProjection({epsgCode: data.fullExtent.spatialReference.wkid});
          const extent = data.fullExtent;
          const sw = projection.unproject(
            new Cesium.Cartesian3(
              extent['xmin'],
              extent.ymin,
              0.0
            )
          );
          const ne = projection.unproject(
            new Cesium.Cartesian3(
              extent.xmax,
              extent.ymax,
              0.0
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
      imageryProviderBuilder.rectangle =
        imageryProviderBuilder.tilingScheme.rectangle;
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

function buildImageResource(imageryProvider, x, y, level, request?) {
  let resource;
  if (imageryProvider._useTiles) {
    resource = imageryProvider._resource.getDerivedResource({
      url: `tile/${level}/${y}/${x}`,
      request: request,
    });
  } else {
    const nativeRectangle = imageryProvider._tilingScheme.tileXYToNativeRectangle(
      x,
      y,
      level
    );
    const bbox = `${nativeRectangle.west},${nativeRectangle.south},${nativeRectangle.east},${nativeRectangle.north}`;

    const query = {
      bbox: bbox,
      size: `${imageryProvider._tileWidth},${imageryProvider._tileHeight}`,
      format: "png32",
      transparent: true,
      f: "image",
      bboxSR: 4326,
      imageSR: 4326,
      layers: ''
    };

    if (
      imageryProvider._tilingScheme.projection instanceof Cesium.GeographicProjection
    ) {
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
      request: request,
      queryParameters: query,
    });
  }
  return resource;
}

class ImageryProviderBuilder {
  useTiles = null
  tilingScheme = null
  rectangle = null
  ellipsoid = null
  credit = null
  tileCredits = null
  tileDiscardPolicy = null
  tileWidth = null
  tileHeight = null
  maximumLevel = null

  constructor(options) {
    this.useTiles = Cesium.defaultValue(options.usePreCachedTilesIfAvailable, true);

    const ellipsoid = options.ellipsoid;
    this.tilingScheme = Cesium.defaultValue(
      options.tilingScheme,
      new Cesium.GeographicTilingScheme({ ellipsoid: ellipsoid })
    );
    this.rectangle = Cesium.defaultValue(options.rectangle, this.tilingScheme.rectangle);
    this.ellipsoid = ellipsoid;
  
    let credit = options.credit;
    if (typeof credit === "string") {
      credit = new Cesium.Credit(credit);
    }
    this.credit = credit;
    this.tileCredits = undefined;
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
  
    // Install the default tile discard policy if none has been supplied.
    if (this.useTiles && !Cesium.defined(this.tileDiscardPolicy)) {
      provider._tileDiscardPolicy = new Cesium.DiscardMissingTileImagePolicy({
        missingImageUrl: buildImageResource(provider, 0, 0, this.maximumLevel).url,
        pixelsToCheck: [
          new Cesium.Cartesian2(0, 0),
          new Cesium.Cartesian2(200, 20),
          new Cesium.Cartesian2(20, 200),
          new Cesium.Cartesian2(80, 110),
          new Cesium.Cartesian2(160, 130),
        ],
        disableCheckIfAllPixelsAreTransparent: true,
      });
    }
  };
}