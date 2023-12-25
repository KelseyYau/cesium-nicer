import gcoord from 'gcoord'

export default class Gcj02TillingScheme extends Cesium.WebMercatorTilingScheme {
  private _projection = null
  
  constructor(options) {
    super(options)
    const mercatorProjection = new Cesium.WebMercatorProjection(this.ellipsoid)
    this._projection.project = function(catographic: Cesium.Cartographic, result: Cesium.Cartesian3) {
      const LngLat84: [number, number] = [Cesium.Math.toDegrees(catographic.longitude), Cesium.Math.toDegrees(catographic.latitude)]
      const LngLatgcj02 = gcoord.transform(LngLat84, gcoord.WGS84, gcoord.GCJ02)
      const cartographicGcj02 = new Cesium.Cartographic(Cesium.Math.toRadians(LngLatgcj02[0]), Cesium.Math.toRadians(LngLatgcj02[1]))
      return mercatorProjection.project(cartographicGcj02, result)
    }

    this._projection.unproject = function(cartesian:  Cesium.Cartesian3, result: Cesium.Cartographic) {
      let cartographic84 = mercatorProjection.unproject(cartesian, result)
      let LngLat84: [number, number] = [Cesium.Math.toDegrees(cartographic84.longitude), Cesium.Math.toDegrees(cartographic84.latitude)]
      let LngLatgcj02 = gcoord.transform(LngLat84, gcoord.WGS84, gcoord.GCJ02)
      return new Cesium.Cartographic(LngLatgcj02[0], LngLatgcj02[1])
    }
  }


}