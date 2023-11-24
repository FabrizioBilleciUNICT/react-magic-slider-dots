import pkg from './package.json'
import postcss from 'rollup-plugin-postcss';
import url from 'rollup-plugin-url';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import path from 'path';

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    postcss({
      extract: path.resolve(__dirname, 'dist/magic-dots.css'),
      minimize: true
    }),
    url(),
    babel({
      babelHelpers: 'runtime',
      skipPreflightCheck: 'true',
      extensions: [...DEFAULT_EXTENSIONS, '.ts'],
      exclude: /^(.+\/)?node_modules\/.+$/,
    }),
    resolve(),
    commonjs(),
    /*minify({
      comments: false
    })*/
  ]
}
