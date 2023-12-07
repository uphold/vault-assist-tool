/* eslint-disable no-process-env, no-sync */
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { DefinePlugin, ProvidePlugin } from 'webpack';
// eslint-disable-next-line import/default
import CopyPlugin from 'copy-webpack-plugin';
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import path from 'path';

const environment = process.env.NODE_ENV || 'development';
const isDevelopment = environment === 'development' || process.env.LOCAL_DEVELOPMENT === 'true';
const outputPath = path.resolve('public');
const publicPath = isDevelopment ? '/' : '/vault-assist-tool/';

const plugins = [
  new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: ['**/*'],
    cleanStaleWebpackAssets: false
  }),
  new CopyPlugin({
    patterns: [
      {
        context: path.resolve('src/assets'),
        from: 'favicon',
        to: path.resolve('public/favicon')
      }
    ]
  }),
  new DuplicatePackageCheckerPlugin(),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    minify: !isDevelopment,
    publicPath,
    template: path.resolve('src/views/index.html')
  }),
  // Add support for Reanimated
  new DefinePlugin({
    __DEV__: isDevelopment,
    process: { env: {} }
  }),
  new ProvidePlugin({
    Buffer: ['buffer', 'Buffer'],
    process: 'process/browser'
  })
];

/** @type {import("webpack").Configuration}  */
const webpackConfig = {
  devServer: {
    allowedHosts: 'auto',
    client: {
      overlay: { warnings: false },
      progress: true
    },
    compress: true,
    devMiddleware: {
      stats: {
        chunks: false,
        colors: true,
        modules: false
      },
      writeToDisk: true
    },
    historyApiFallback: true,
    hot: false,
    port: 3000,
    setupExitSignals: false,
    static: {
      directory: path.resolve('public'),
      watch: { ignored: /node_modules/ }
    }
  },
  devtool: isDevelopment ? 'eval-source-map' : false,
  entry: { vaultassist: './src/index.js' },
  mode: isDevelopment ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        exclude: /node_modules\/(?!events-logger).+/,
        test: /\.js?$/,
        use: 'babel-loader'
      },
      {
        test: /\.png$/,
        use: 'url-loader'
      },
      {
        loader: '@svgr/webpack',
        options: {
          svgProps: { role: 'img' },
          svgoConfig: {
            plugins: [
              {
                name: 'preset-default',
                params: { overrides: { removeTitle: false, removeUnknownsAndDefaults: { keepRoleAttr: true } } }
              },
              'prefixIds'
            ]
          },
          titleProp: true
        },
        test: /\.svg$/
      }
    ]
  },
  optimization: {
    minimize: !isDevelopment,
    minimizer: [new TerserPlugin({ extractComments: false, terserOptions: { output: { comments: false } } })],
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'all',
          name: 'vaultassist.vendor',
          priority: -15,
          reuseExistingChunk: true,
          test: /node_modules/
        }
      }
    }
  },
  output: {
    filename: '[name].[contenthash].js',
    path: outputPath,
    publicPath
  },
  plugins,
  resolve: {
    alias: {
      lodash: path.resolve('node_modules/lodash-es'),
      'lodash-es': path.resolve('node_modules/lodash-es'),
      node_modules: path.resolve('node_modules'),
      react: path.resolve('node_modules/react'),
      // Add support for react-native
      'react-native$': path.resolve('node_modules/react-native-web'),
      // Necessary for Reanimated to work
      'react-native/Libraries/Renderer/shims': false,
      'react-native-reanimated': path.resolve('node_modules/react-native-reanimated'),
      'react-native-web': path.resolve('node_modules/react-native-web'),
      src: path.resolve('src'),
      'styled-components': path.resolve('node_modules/styled-components')
    },
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      stream: require.resolve('stream-browserify'),
      url: require.resolve('url')
    }
  }
};

export default webpackConfig;
