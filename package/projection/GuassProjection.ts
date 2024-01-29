import { getProjData4ByCode } from "./gauss-proj4"
import proj4 from 'proj4'

const WGS84_PROJ4 = '+proj=longlat +datum=WGS84 +no_defs +type=crs'

export default class GuassProjection extends Cesium.WebMercatorProjection {
  private _ellipsoid = null
  private _semimajorAxis = null
  private _oneOverSemimajorAxis = null
  private _epsgCode = null
  private _pro4Str = null

  constructor(options) {
    super(options)

    this._ellipsoid = Cesium.defaultValue(options.ellisoid, Cesium.Ellipsoid.WGS84)
    this._semimajorAxis = this._ellipsoid.maximumRadius
    this._oneOverSemimajorAxis = 1.0 / this._semimajorAxis
    this._epsgCode = options.epsgCode
    this._pro4Str = getProjData4ByCode(this._epsgCode).proj4 || options.proj4Str || ''
  }

  project(cartographic: Cesium.Cartographic, result?: Cesium.Cartesian3): Cesium.Cartesian3 {
    const lng = cartographic.longitude
    const lat = cartographic.latitude
    const dlng = Cesium.Math.toDegrees(lng)
    const dlat = Cesium.Math.toDegrees(lat)
    const gaussXY = proj4(this._pro4Str, [dlng, dlat])
    const [x, y] = gaussXY
    const z = cartographic.height

    if(!Cesium.defined(result)) {
      return new Cesium.Cartesian3(x, y ,z)
    }

    result.x = x
    result.y = y
    result.z = z
    return result
  }

  unproject(cartesian: Cesium.Cartesian3, result?: Cesium.Cartographic): Cesium.Cartographic {
    if (!Cesium.defined(cartesian)) {
      throw new Cesium.DeveloperError("cartesian is required");
    }

    const [x, y] = [cartesian.x, cartesian.y]
    const lnglat = proj4(this._pro4Str, WGS84_PROJ4, [x, y])
    const lng = Cesium.Math.toRadians(lnglat[0])
    const lat = Cesium.Math.toRadians(lnglat[1])
    const height = cartesian.z

    if(!Cesium.defined(result)) {
      return new Cesium.Cartographic(lng, lat, height)
    }

    result.longitude = lng
    result.latitude = lat
    result.height = height
    return result
  }
}