import { defineConfig } from 'rollup'
import { builtinModules } from 'module'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import pkg from './package.json' assert { type: 'json' };

const external = [
  ...builtinModules,
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]

export default defineConfig([{
  input: 'package/index.ts',
  output: {
    dir: 'dist',
    format: 'es',
    entryFileNames: '[name].js',
    chunkFileNames: 'chunk-[name].js',
    globals: {
      Cesium: 'Cesium'
    }
  },
  external,
  plugins: [
    esbuild({
      target: 'node14',
    }),
  ],
  onwarn
},{
  input: 'package/index.ts',
  output: {
    dir: 'dist',
    entryFileNames: '[name].d.ts',
    format: 'esm'
  },
  external,
  plugins: [
    dts({respectExternal: true})
  ],
  onwarn
},{
  input: 'package/indexumd.ts',
  output: {
    file: 'dist/CesiumNicer.js',
    name: 'CesiumNicer',
    format: 'umd',
    globals: {
      Cesium: 'Cesium'
    }
  },
  plugins: [
    esbuild({
      target: 'node14',
    }),
  ],
  external,
}])

function onwarn(message) {
  if (['EMPTY_BUNDLE', 'CIRCULAR_DEPENDENCY'].includes(message.code))
    return
  console.error(message)
}