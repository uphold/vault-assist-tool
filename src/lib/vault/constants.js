import { Network, NetworkUtil } from 'vault-wallet-toolkit';

// Set testnet if we are on dev
NetworkUtil.setNetwork(__DEV__ ? Network.DEVELOPMENT : Network.PRODUCTION);
