interface BaseOptions {
  id?: string
  minimumLevel?: number
  maximumLevel?: number
  name?: string
}

export default class BaseLayer {
  public name: string
  public id: string
  public layerType: string
  protected layer: Cesium.ImageryLayer
  private _alpha: number

  constructor(options: BaseOptions) {
    this.name = options.name
    this.id = options.id || Cesium.createGuid()
    this._alpha = 1
  }

  get opacity(): number {
    return this._alpha
  }

  set opacity(alpha: number) {
    if(this.layer) { this.layer.alpha = alpha }
    this._alpha = alpha
  }

  get visible(): boolean {
    if(this.layer) {
      return this.layer.show
    } else {
      return false
    }
  }

  set visible(show: boolean) {
    if(this.layer) {
      this.layer.show = show
    }
  }
}