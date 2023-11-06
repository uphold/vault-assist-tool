const { version } = require('../../package.json');

module.exports = {
  blockchain: {
    bitcoin: 'https://blockchain.info/tx/',
    'bitcoin-cash': 'https://www.blockchain.com/BCC/tx/',
    'bitcoin-gold': 'https://btgexplorer.com/tx/',
    dash: 'https://explorer.dash.org/tx/',
    ethereum: 'https://etherscan.io/tx/',
    litecoin: 'https://insight.litecore.io/tx/',
    voxel: 'https://www.blockexperts.com/vox/tx/',
    'xrp-ledger': 'https://xrpcharts.ripple.com/#/transactions/',
  },
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
