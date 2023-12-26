import gcoord from 'gcoord'

export default class Gcj02TilingScheme extends Cesium.WebMercatorTilingScheme {
  private _projection = null
  
  constructor(options) {
    super(options)
    this._projection = new Cesium.WebMercatorProjection(this.ellipsoid)
    const mercatorProjection = new Cesium.WebMercatorProjection(this.ellipsoid)
    this._projection.project = function(catographic: Cesium.Cartographic, result: Cesium.Cartesian3) {
      const LngLat84: [number, number] = [Cesium.Math.toDegrees(catographic.longitude), Cesium.Math.toDegrees(catographic.latitude)]
      const LngLatgcj02 = gcoord.transform(LngLat84, gcoord.WGS84, gcoord.GCJ02)
      const cartographicGcj02 = new Cesium.Cartographic(Cesium.Math.toRadians(LngLatgcj02[0]), Cesium.Math.toRadians(LngLatgcj02[1]))
      const mercator = mercatorProjection.project(cartographicGcj02, result)
      return new Cesium.Cartesian2(mercator.x, mercator.y)
    }

    this._projection.unproject = function(cartesian:  Cesium.Cartesian3, result: Cesium.Cartographic) {
      let cartographic84 = mercatorProjection.unproject(cartesian, result)
      let LngLatGcj02: [number, number] = [Cesium.Math.toDegrees(cartographic84.longitude), Cesium.Math.toDegrees(cartographic84.latitude)]
      let LngLat84 = gcoord.transform(LngLatGcj02, gcoord.GCJ02, gcoord.WGS84)
      return new Cesium.Cartographic(Cesium.Math.toRadians(LngLat84[0]), Cesium.Math.toRadians(LngLat84[1]))
    }
  }


}