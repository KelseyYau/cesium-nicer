declare global {
  interface Window {
    Cesium: Cesium
  }
}

export interface LooseObject {
  [key: string]: any
}