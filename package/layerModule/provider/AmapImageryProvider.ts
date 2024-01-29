import Gcj02TilingScheme from "../../tilingScheme/Gcj02TilingScheme";

export default class AmapImageryProvider extends Cesium.UrlTemplateImageryProvider {
  private _tilingScheme: Gcj02TilingScheme

  constructor(options) {
    options['tilingScheme'] = new Gcj02TilingScheme({})
    super(options)
  }
}