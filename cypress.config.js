/* eslint-disable no-process-env */
const { DefinePlugin, ProvidePlugin } = require('webpack');
const { defineConfig } = require('cypress');
const webpackPreprocessor = require('@cypress/webpack-preprocessor');

const environment = process.env.NODE_ENV || 'development';
const isDevelopment = environment === 'development' || process.env.LOCAL_DEVELOPMENT === 'true';

module.exports = defineConfig({
  defaultCommandTimeout: 40000,
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      require('@cypress/grep/src/plugin')(config);
      const options = webpackPreprocessor.defaultOptions;

      options.webpackOptions.plugins = [
        new DefinePlugin({
          __DEV__: isDevelopment
        }),
        new ProvidePlugin({
          process: 'process/browser'
        }),
        new ProvidePlugin({
          Buffer: ['buffer', 'Buffer']
        })
      ];

      options.webpackOptions.module.rules = [
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
          exclude: /node_modules/,
          test: /\.(ts|tsx)$/,
          use: ['ts-loader']
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
      ];

      options.webpackOptions.resolve = {
        extensions: ['.ts', '.js', '.json'],
        fallback: {
          buffer: require.resolve('buffer/'),
          crypto: require.resolve('crypto-browserify'),
          http: require.resolve('stream-http'),
          https: require.resolve('https-browserify'),
          net: false,
          stream: require.resolve('stream-browserify'),
          tls: false,
          url: require.resolve('url')
        }
      };
      on('file:preprocessor', webpackPreprocessor(options));

      on('task', {
        log(message) {
          console.log(message);

          return null;
        }
      });

      return config;
    },
    specPattern: 'test/cypress/integration/**/*.js',
    supportFile: 'test/cypress/support/e2e.js'
  },
  fixturesFolder: 'test/cypress/fixtures',
  responseTimeout: 20000,
  screenshotsFolder: 'test/cypress/screenshots',
  videoCompression: false,
  videosFolder: 'test/cypress/videos',
  viewportHeight: 1080,
  viewportWidth: 1920,
  watchForFileChanges: false
});
