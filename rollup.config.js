import fs from 'fs';
import path from 'path';
import ini from 'ini';
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
import analyze from 'rollup-analyzer-plugin'
// PostCss
import postcss from 'rollup-plugin-postcss';
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';
import lost from 'lost';
import to from 'to-case';

/* NOTE!
Be sure to up `ulimit` on the system for --watch!
1) $: "echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p"
If 1) doesn't work:
2) https://underyx.me/2015/05/18/raising-the-maximum-number-of-file-descriptors
*/

// `.env`-setttings
const envFilePath = path.join(__dirname, '.env');
const DOT_ENV_SETTINGS = ini.parse(fs.existsSync(envFilePath) ? fs.readFileSync(envFilePath, 'utf8') : '');

console.log('DOT_ENV_SETTINGS', envFilePath, DOT_ENV_SETTINGS)

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

const ENV = process.env.NODE_ENV || process.env.ENV || 'development';
const BUNDLE = process.env.BUNDLE;

const plugins = [
  fileCopy({src:  './index.html', targ: './dist/index.html'}),
  replace({
    'process.env.ENV': JSON.stringify(ENV),
    'process.env.DOT_ENV_SETTINGS': JSON.stringify(DOT_ENV_SETTINGS),
  }),
  resolve({
    jsnext: true,
    main: true,
    browser: true,
    preferBuiltins: true,
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
  (ENV.startsWith('prod') ? uglify({}, esMinifier) : ()=>{}),
];

const externals = {
  "react": "React",
  "react-dom": "ReactDOM",
  "prop-types": "PropTypes",
  "react-router-dom": "ReactRouterDOM",
  "reactstrap": "Reactstrap", // TODO! This should just be bundled into `my-ui-components` (But that failed, so needs research!)
  // My bundles
  "my-jsonschema-form": "MyJsonschemaForm",
  "my-ui-components": "MyUiComponents",
  "my-history-singleton": "MyHistorySingleton",
  "my-accounting": "MyAccounting",
};

const defaultOptions = {

};

const bundles = [
  ['app', { input: 'src/index.js' }],
  ['my-jsonschema-form', {
    input: 'custom-bundles/my-jsonschema-form/index.js',
    output: {
      exports: 'named',
    }
  }],
  ['my-ui-components', {
    input: 'custom-bundles/my-ui-components/index.js',
    output: {
      exports: 'named',
    }
  }],
  ['my-history-singleton', {
    input: 'custom-bundles/my-history-singleton.js',
    output: {
      exports: 'named',
    }
  }],
  ['my-accounting', {
    input: 'custom-bundles/my-accounting/index.js',
    output: {
      exports: 'named',
    }
  }],
];

export default bundles
  .map(([name, options={}]) => ({
    name: name,
    options: options,
  }))
  .filter(bundle => !BUNDLE || BUNDLE == bundle.name)
  .map(bundle => {

    const output = Object.assign({
      // Non-overridables
      globals: externals,
      format: 'iife',
    }, bundle.options.output || {}, {
      // Overridables
      name: to.pascal(bundle.name),
      file: `dist/js/${to.slug(bundle.name)}.js`,
      sourcemap: true,
    });

    console.log(`BUNDLE "${bundle.name}": ${bundle.options.input} => ${output.file}:\n`, output)

    return {
      input: bundle.options.input,
      plugins: plugins,
      external: Object.keys(externals),
      output: output,
    };
  });