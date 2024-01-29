import GuassProjection from "../projection/GuassProjection"

export default class GaussProjectTilingScheme extends Cesium.WebMercatorTilingScheme {
  private _projection: GuassProjection
  private _resolutions = []
  private _origin = []
  private _extent = []
  private _epsgCode = null
  private _rectangleSouthwestInMeters
  private _rectangleNortheastInMeters
  private _rectangle
  private _tileSize = 256
  private _numberOfLevelZeroTilesX
  private _numberOfLevelZeroTilesY

  constructor(options) {
    super(options)
    this._projection = new GuassProjection({epsgCode: options.epsgCode})
    this._epsgCode = options.epsgCode
    this._origin = options.origin
    this._resolutions = options.resolutions || []
    this._extent = options.extent
    this._rectangleSouthwestInMeters = new Cesium.Cartesian2(
      this._extent[0],
      this._extent[1]
    )
    this._rectangleNortheastInMeters = new Cesium.Cartesian2(
      this._extent[2],
      this._extent[3]
    )
    const southwest = this._projection.unproject(this._rectangleSouthwestInMeters)
    const northeast = this._projection.unproject(this._rectangleNortheastInMeters)
    this._rectangle = new Cesium.Rectangle(
      southwest.longitude,
      southwest.latitude,
      northeast.longitude,
      northeast.latitude
    )
    this.initZeroTilesXY()
  }

  initZeroTilesXY() {
    const zeroResolutions = this._resolutions[0]
    const lefttopX = Math.floor((Math.abs(this._origin[0] - this._extent[0])) / (zeroResolutions * this._tileSize))
    const lefttopY = Math.floor((Math.abs(this._origin[1] - this._extent[3])) / (zeroResolutions * this._tileSize))
    const rightBottomX = Math.floor((Math.abs(this._origin[0] - this._extent[2])) / (zeroResolutions * this._tileSize))
    const rightBottomY = Math.floor((Math.abs(this._origin[1] - this._extent[1])) / (zeroResolutions * this._tileSize))
    this._numberOfLevelZeroTilesX = Math.abs(rightBottomX - lefttopX) + 1
    this._numberOfLevelZeroTilesY = Math.abs(lefttopY - rightBottomY) + 1
  }

  rectangleToNativeRectangle (
    rectangle,
    result
  ) {
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

  tileXYToNativeRectangle (
    x,
    y,
    level,
    result
  ) {
    const xTiles = this.getNumberOfXTilesAtLevel(level);
    const yTiles = this.getNumberOfYTilesAtLevel(level);
    const resolution = this._resolutions[level]
    const lefttopX = Math.floor((Math.abs(this._origin[0] - this._extent[0])) / (resolution * this._tileSize))
    const lefttopY = Math.floor((Math.abs(this._origin[1] - this._extent[3])) / (resolution * this._tileSize))

    const xTileWidth =
      (this._rectangleNortheastInMeters.x - this._rectangleSouthwestInMeters.x) /
      xTiles;
    const startX = x - lefttopX
    const startY = y - lefttopY
    const west = this._rectangleSouthwestInMeters.x + startX * xTileWidth;
    const east = this._rectangleSouthwestInMeters.x + (startX + 1) * xTileWidth;
  
    const yTileHeight =
      (this._rectangleNortheastInMeters.y - this._rectangleSouthwestInMeters.y) /
      yTiles;
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

  tileXYToRectangle (
    x,
    y,
    level,
    result
  ) {
    const nativeRectangle = this.tileXYToNativeRectangle(x, y, level, result)
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

  positionToTileXY(
    position,
    level,
    result
  ) {
    const rectangle = this._rectangle;
    if (!Cesium.Rectangle.contains(rectangle, position)) {
      // outside the bounds of the tiling scheme
      return undefined;
    }
    const resolution = this._resolutions[level]
    const lefttopX = Math.floor((Math.abs(this._origin[0] - this._extent[0])) / (resolution * this._tileSize))
    const lefttopY = Math.floor((Math.abs(this._origin[1] - this._extent[3])) / (resolution * this._tileSize))

    const xTiles = this.getNumberOfXTilesAtLevel(level);
    const yTiles = this.getNumberOfYTilesAtLevel(level);
  
    const overallWidth =
      this._rectangleNortheastInMeters.x - this._rectangleSouthwestInMeters.x;
    const xTileWidth = overallWidth / xTiles;
    const overallHeight =
      this._rectangleNortheastInMeters.y - this._rectangleSouthwestInMeters.y;
    const yTileHeight = overallHeight / yTiles;
  
    const projection = this._projection;
  
    const gaussPosition = projection.project(position);
    const distanceFromWest =
      gaussPosition.x - this._rectangleSouthwestInMeters.x;
    const distanceFromNorth =
      this._rectangleNortheastInMeters.y - gaussPosition.y;
  
    let xTileCoordinate = (distanceFromWest / xTileWidth) | 0;
    if (xTileCoordinate >= xTiles) {
      xTileCoordinate = xTiles - 1;
    }
    let yTileCoordinate = (distanceFromNorth / yTileHeight) | 0;
    if (yTileCoordinate >= yTiles) {
      yTileCoordinate = yTiles - 1;
    }
    
    xTileCoordinate = xTileCoordinate + lefttopX
    yTileCoordinate = yTileCoordinate + lefttopY

    if (!Cesium.defined(result)) {
      return new Cesium.Cartesian2(xTileCoordinate, yTileCoordinate);
    }
  
    result.x = xTileCoordinate;
    result.y = yTileCoordinate;
    return result;
  };
}