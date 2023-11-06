module.exports = (api) => {
  const isDevelopment = api.env('development');

  api.cache(false);

  const plugins = [
    ['babel-plugin-styled-components', { ssr: false }],
    '@babel/plugin-proposal-export-default-from',
    'react-native-web',
    'react-native-reanimated/plugin',
  ];

  if (isDevelopment) {
    plugins.push(['istanbul', {}, 'istanbul-coverage']);
  }

  const presets = [
    [
      '@babel/preset-env',
      {
        corejs: 3,
        exclude: ['transform-typeof-symbol'],
        useBuiltIns: 'entry',
      },
    ],
    ['@babel/preset-react', { runtime: 'automatic', useBuiltIns: true }],
  ];

  return { plugins, presets };
};
