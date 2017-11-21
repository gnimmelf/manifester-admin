// rollup.config.js
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import json from 'rollup-plugin-json';
// PostCss
import postcss from 'rollup-plugin-postcss';
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';
import postcssModules from 'postcss-modules';
import cssnano from 'cssnano';


const ENV = process.env.NODE_ENV || 'development';

const cssExportMap = {};

const plugins = [
  json(),
  resolve({
    jsnext: true,
    main: true,
    browser: true,
  }),
  commonjs({
    include: [
      'node_modules/**'
    ],
    exclude: [
      'node_modules/process-es6/**'
    ],
    namedExports: {
      'node_modules/react/react.js': ['Children', 'Component', 'PropTypes', 'createElement'],
      'node_modules/react-dom/index.js': ['render']
    }
  }),
  postcss({
    extensions: [ '.css' ],
    plugins: [
      simplevars(),
      nested(),
      cssnext({ warnForDuplicates: false, }),
      postcssModules({
        getJSON (id, exportTokens) {
          cssExportMap[id] = exportTokens;
        }
      }),
      cssnano(),
    ],
    getExportNamed: false, //Default false, when set to true it will also named export alongside default export your class names
    getExport (id) {
      return cssExportMap[id];
    }
  }),
  babel({
    exclude: 'node_modules/**' // only transpile our source code
  }),
  replace({
    ENV: JSON.stringify(ENV),
    'process.env.NODE_ENV': JSON.stringify(ENV)
  }),
  (ENV === 'production' && uglify()),
];

const defaultOptions = {
  plugins: plugins,
  external: ['jquery'],
  globals: {
    jquery: '$'
  },
};

export default ['index'].map(entryBaseName => Object.assign({}, defaultOptions, {
  input: `src/${entryBaseName}.js`,
  output: {
    file: `dist/${entryBaseName}.js`,
    format: 'iife',
    name: `${entryBaseName}`,
  },
  sourcemap: 'inline',
}));
