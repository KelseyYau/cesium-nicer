import BaseLayer from "./BaseLayer"
import AmapImageryProvider from '../provider/AmapImageryProvider'

interface AmapOptions {
  id?: string
  url?: string
  type: string
  name?: string
  subdomains?: string | Array<string>
  minimumLevel?: number
  maximumLevel?: number
}

const TILE_URL = {
  'img':  "https://webst{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
  'vec': "http://webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
  'cva': "http://webst{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8"
}

export default class AmapLayer extends BaseLayer {
  private _provider: AmapImageryProvider
  private _options: AmapOptions

  constructor(options: AmapOptions) {
    super(options)
    this._provider = this.initProvider(options)
    this._options = options
    this.layerType = 'AMAP'
  }

  initProvider(options: AmapOptions) {
    const { type, url, minimumLevel, maximumLevel, subdomains } = options
    const provider = new AmapImageryProvider({
      url: url || TILE_URL[type],
      minimumLevel: minimumLevel || 2,
      maximumLevel: maximumLevel || 18,
      subdomains: subdomains || ['01', '02', '03', '04']
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