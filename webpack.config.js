const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { DefinePlugin } = require('webpack');

module.exports = (env, argv) => {
  const mode = argv.mode || 'production';
  const devtool = mode === 'development' ? 'eval-source-map' : 'source-map';

  return {
    mode,
    entry: {
      katalis: './src/index.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: false
    },
    module: {
      rules: [
        {
          test: /\.bpmn$/,
          type: 'asset/source'
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: './assets', to: 'vendor/bpmn-js-token-simulation/assets' },
          { from: 'bpmn-js/dist/assets', context: 'node_modules', to: 'vendor/bpmn-js/assets' },
          { from: '@bpmn-io/properties-panel/dist/assets', context: 'node_modules', to: 'vendor/bpmn-js-properties-panel/assets' },
          { from: '@bpmn-io/diagram-js-canvas-lock/assets', context: 'node_modules', to: 'vendor/diagram-js-canvas-lock/assets' }
        ]
      }),
      new DefinePlugin({
        'process.env.KATALIS_VERSION': JSON.stringify(require('./package.json').version),
        'process.env.SUPABASE_URL': JSON.stringify('https://xrtfqufwbgbwgtwayuqt.supabase.co')
      })
    ],
    devServer: {
      static: {
        directory: __dirname
      },
      compress: true,
      port: 8080,
      hot: true
    },
    devtool
  };
};
