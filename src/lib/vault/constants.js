import { Network, NetworkUtil } from 'vault-wallet-toolkit';

// eslint-disable-next-line no-process-env
const { NODE_ENV } = process.env;

// Set testnet if we are on dev
NetworkUtil.setNetwork(NODE_ENV === 'production' ? Network.PRODUCTION : Network.DEVELOPMENT);
