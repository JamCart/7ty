import { plugin as hydration, preprocess } from '@jamcart/7ty/hydrate'
import { minify } from 'html-minifier-terser'

import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import copy from 'rollup-plugin-copy'
import css_chunks from 'rollup-plugin-css-chunks'
import del from 'rollup-plugin-delete'
import glob from 'rollup-plugin-glob'
import markdown from '@jackfranklin/rollup-plugin-markdown'
import multi_input from 'rollup-plugin-multi-input'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'


function minify_html (options = {}) {
  return {
    name: 'html-minifier-terser',

    generateBundle(outputOptions, bundle) {
      Object.values(bundle).forEach((file) => {
        if (file.type === 'asset' && file.fileName.endsWith('.html')) {
          file.source = minify(file.source.toString(), options)
        }
      })
    }  
  }
}


function shared_plugins ({ browser, watch }) {
  return [
    alias({
      resolve: ['.js', '.svelte'],
      entries: {
        // Partial hydration currently depends on this alias
        '$src': './src'
      }
    }),
    glob(),
    markdown(),
    replace({
      'process.browser': JSON.stringify(browser),
      'process.env.NODE_ENV': JSON.stringify(watch ? 'development' : ''),
      preventAssignment: true
    }),
    resolve({ browser }),
    commonjs(),
  ]
}


export function client ({ watch }) {
  return {
    input: ['build/html/**/*.html'],
    output: {
      chunkFileNames: '[hash].js',
      dir: 'public',
      sourcemap: true
    },
    plugins: [
      multi_input.default({ relative: 'build/html' }),
      ...shared_plugins({ browser: true, watch }),
      !watch && del({ targets: 'public/*' }),
      svelte({
        compilerOptions: {
          css: false,
          hydratable: true,
        },
        emitCss: false
      }),
      hydration(),
      copy({
        targets: [
          { src: 'static/*', dest: 'public' },
          { src: ['build/server/**/*', '!**/*.js', '!**/*.js.map'], dest: 'public' }
        ]
      }),
      !watch && minify_html({
        caseSensitive: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }),
      !watch && terser(),
    ]
  }
}


export function server ({ watch }) {
  return {
    input: ['src/routes/**/[!_]*.svelte', '!src/routes/**/_*/**'],
    output: {
      dir: 'build/server',
      entryFileNames: '[name]-[hash].js',
      sourcemap: 'inline'
    },
    plugins: [
      multi_input.default({ relative: 'src/routes' }),
      ...shared_plugins({ browser: false, watch }),
      del({ targets: 'build/*' }),
      svelte({
        compilerOptions: {
          generate: 'ssr',
          hydratable: true,
          immutable: true,
        },
        preprocess: [preprocess]
      }),
      css_chunks.default({
        chunkFileNames: '[hash].css',
        entryFileNames: '[hash].css'
      })
    ]
  }
}
