enum TiandituType {
  Vec = 'vec',
  Img = 'img',
  Ter = 'ter',
  Cia = 'cia',
  Cva = 'cva',
  Cta = 'cta',
  Ibo = 'ibo'
}

interface TiandituOptions {
  id?: string
  url?: '',
  type: TiandituType,
  tk: string,
  subdomains?: string|Array<string>
}

export default class TiandituLayer {
  private _provider: Cesium.WebMapTileServiceImageryProvider
  private _options: TiandituOptions
  private _layer: Cesium.ImageryLayer
  public id: string

  constructor(options: TiandituOptions) {
    this._options = options
    this._provider = this.initProvider(options)
  }

  initProvider(options: TiandituOptions) {
    this.id = options.id || Cesium.createGuid()
    const type = options.type || 'img'
    const tileMatrix = 'w'
    const defaultSubdomains = ['0','1','2','3','4','5','6','7']
    const provider = new Cesium.WebMapTileServiceImageryProvider({
      url: options.url || `http://t{s}.tianditu.gov.cn/${type}_w/wmts?tk=${options.tk}`,
      layer: type,
      format: 'tiles',
      style: 'default',
      tileMatrixSetID: tileMatrix,
      subdomains: defaultSubdomains,
      maximumLevel: 18,
      tilingScheme: new Cesium.WebMercatorTilingScheme()
    })
    return provider
  }

  add(viewer: Cesium.Viewer): Cesium.ImageryLayer {
    if (!viewer) throw new Error('undefined viewer');
    this._layer = viewer.imageryLayers.addImageryProvider(this._provider)
    return this._layer
  }

  remove(viewer: Cesium.Viewer): void {
    if (!viewer) throw new Error('undefined viewer');
    viewer.imageryLayers.remove(this._layer)
  }

  
} 