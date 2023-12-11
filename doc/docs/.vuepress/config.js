const navbar = require('./config/navbar')
const sidebar = require('./config/sidebar')
import { defineUserConfig } from 'vuepress'
import { defaultTheme } from 'vuepress'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { getDirname, path } from '@vuepress/utils'

const __dirname = getDirname(import.meta.url)

console.log(__dirname)
export default defineUserConfig({
  // 站点配置
  lang: 'zh-CN',
  title: 'cesium-nicer',
  description: 'Cesium使用的好助手',
  head: [ // 注入到当前页面的 HTML <head> 中的标签
    [
      'script', {
        type: 'text/javascript',
        src: '/js/Cesium-1.112/Build/Cesium/Cesium.js'
      }
    ],
    [
      'script', {
        type: 'text/javascript',
        src: '/js/CesiumNicer/CesiumNicer.js'
      }
    ],
    [
      'link', {
        rel: "stylesheet",
        href: "/js/Cesium-1.112/Build/Cesium/Widgets/widgets.css"
      }
    ],
    [
      'link', {
        rel: "stylesheet",
        href: "/style/default.css"
      }
    ]
  ],
  // 主题和它的配置
  theme: defaultTheme({
    logo: '/img/logo.jpg',
    navbar,
    sidebar,
    sidebarDepth: 3, // 侧边栏显示2级
  }),
  plugins: [
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, '../components'),
    }),
  ]
})
