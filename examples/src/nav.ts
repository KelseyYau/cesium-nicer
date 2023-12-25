const presets = [
  {
    name: '预设',
    url: '/presets',
    id: '1',
    children: [{
      name: 'viewer设置',
      url: '/presets/viewer',
      id: '1-1'
    }]
  }
]

const layerModule = [
  {
    name: '图层',
    url: '/layerModule',
    id: '2',
    children: [{
      name: '天地图',
      url: '/layerModule/tianditu',
      id: '2-1'
    }]
  }
]

export default [
  ...presets,
  ...layerModule
]