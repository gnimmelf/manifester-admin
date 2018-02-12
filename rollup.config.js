import fs from 'fs';
import path from 'path';
// rollup.config.js
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import { minify as esMinifier } from 'uglify-es';
import json from 'rollup-plugin-json';
import async from 'rollup-plugin-async';
import analyze from 'rollup-analyzer-plugin'
// PostCss
import postcss from 'rollup-plugin-postcss';
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';
import lost from 'lost';

const fileCopy = function (options) {
  return {
    ongenerate(){
      const targDir = path.dirname(options.targ);
      if (!fs.existsSync(targDir)){
        fs.mkdirSync(targDir);
      }
      fs.writeFileSync(options.targ, fs.readFileSync(options.src));
    }
  };
};

const ENV = process.env.NODE_ENV || 'development';

const cssExportMap = {};

const externals = {
  // "rxjs": "Rx",
  "react": "React",
  "react-dom": "ReactDOM",
  "prop-types": "PropTypes",
  "reactstrap": "Reactstrap",
  "react-router-dom": "ReactRouterDOM",
  "react-jsonschema-form": "JSONSchemaForm",
};

const plugins = [
  fileCopy({src:  './spa.html', targ: './dist/spa.html'}),
  resolve({
    jsnext: true,
    main: true,
    browser: true,
    preferBuiltins: false,
  }),
  commonjs({
    include: [
      'node_modules/**',
    ],
    exclude: [
      'node_modules/process-es6/**',
    ]
  }),
  builtins(),
  globals(),
  json(),
  postcss({
    extensions: [ '.css' ],
    modules: {
      generateScopedName: '[path]___[name]__[local]___[hash:base64:5]'
    },
    plugins: [
      simplevars(),
      nested(),
      cssnext({ warnForDuplicates: false, }),
      cssnano(),
      lost(),
    ]
  }),
  (ENV.startsWith('analyse') ? analyze({limit: 5}) : ()=>{}),
  babel({
    exclude: [
      // only transpile our source code
      'node_modules/**',
      '../react-jsonschema-form/**'
    ]
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify(ENV)
  }),
  (ENV.startsWith('prod') ? uglify({}, esMinifier) : ()=>{}),
];

const defaultOptions = {
  plugins: plugins,
  external: Object.keys(externals),
};

export default ['login', 'admin'].map(entryBaseName => Object.assign({}, defaultOptions, {
  input: `src/${entryBaseName}.js`,
  output: {
    file: `dist/${entryBaseName}.js`,
    format: 'iife',
    name: `${entryBaseName}`,
    sourcemap: 'inline',
    globals: externals,
  },

}));
