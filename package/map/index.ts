import { viewerConfig } from "../presets/viewConfig"

interface MapOptions {

}

export default class CMap {
  private _viewer: Cesium.Viewer
  private _id: string | Element
  private _options: MapOptions

  constructor(id: string | Element, options: MapOptions) {
    this._id = id
    this._options = options
    const viewOptions = {
      ...viewerConfig
    }
    this._viewer = new Cesium.Viewer(id, { ...viewOptions, baseLayer: false})
  }

  get viewer() {
    return this._viewer
  }
}