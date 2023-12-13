import BaseLayer from "./baselayer"

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
  name?: string
  type: TiandituType,
  tk: string,
  subdomains?: string|Array<string>
  minimumLevel?: number
  maximumLevel?: number
}

export default class TiandituLayer extends BaseLayer {
  private _provider: Cesium.WebMapTileServiceImageryProvider
  private _options: TiandituOptions

  constructor(options: TiandituOptions) {
    super(options)
    this._options = options
    this._provider = this.initProvider(options)
    this.layerType = 'TIANDITU'
  }

  initProvider(options: TiandituOptions) {
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
      maximumLevel: options.maximumLevel || 18,
      tilingScheme: new Cesium.WebMercatorTilingScheme()
    })
    return provider
  }

  add(viewer: Cesium.Viewer): Cesium.ImageryLayer {
    if (!viewer) throw new Error('undefined viewer');
    this.layer = viewer.imageryLayers.addImageryProvider(this._provider)
    this.layer['id'] = this.id
    return this.layer
  }

  remove(viewer: Cesium.Viewer): void {
    if (!viewer) throw new Error('undefined viewer');
    viewer.imageryLayers.remove(this.layer)
  }

  
} 