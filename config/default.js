const { version } = require('../../package.json');

module.exports = {
  cache: {
    size: 100,
    ttl: 60 * 1000,
  },
  coachMarks: {
    enabled: false,
  },
  debug: false,
  // eslint-disable-next-line no-process-env
  environment: process.env.NODE_ENV || 'development',
  navigation: [
    {
      isDefault: true,
      name: 'index',
      path: '/',
    },
  ],
  version,
};
