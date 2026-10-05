import { Blockchain, Network, getNetwork, setNetwork } from 'vault-wallet-toolkit';
export { Blockchain, Network, getNetwork, setNetwork };

// eslint-disable-next-line no-process-env
const { NET } = process.env;

// signer requirements for multisig vault
export const DEFAULT_MULTISIG_ENTRIES = 3;
export const DEFAULT_MULTISIG_SIGNERS_REQUIRED = 2;
export const INHERITANCE_MULTISIG_QUORUM = 6;
export const INHERITANCE_MULTISIG_WEIGHTS = [2, 3, 3, 4];

export const getNetworkEnv = () => {
  switch (NET) {
    case 'production':
      return Network.PRODUCTION;
    case 'development':
      return Network.DEVELOPMENT;
    case 'local':
      return Network.LOCAL;
    default:
      return Network.PRODUCTION;
  }
};
