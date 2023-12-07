const navbar = require('./config/navbar')
const sidebar = require('./config/sidebar')
import { defineUserConfig } from 'vuepress'
import { defaultTheme } from 'vuepress'

export default defineUserConfig({
  // 站点配置
  lang: 'zh-CN',
  title: 'cesium-nicer',
  description: 'Cesium使用的好助手',
  head: [ // 注入到当前页面的 HTML <head> 中的标签
    ['link', {
      rel: 'icon',
      href: '/img/logo.jpg'
    }], // 增加一个自定义的 favicon(网页标签的图标)
  ],
  // 主题和它的配置
  theme: defaultTheme({
    logo: '/img/logo.jpg',
    navbar,
    sidebar,
    sidebarDepth: 2, // 侧边栏显示2级
  })
})
