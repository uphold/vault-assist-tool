import { Blockchain, Network, NetworkUtil } from 'vault-wallet-toolkit';
export { Blockchain, Network, NetworkUtil };

// eslint-disable-next-line no-process-env
const { NET } = process.env;

// signer requirements for multisig vault
export const multisigRequirements = {
  entries: 3,
  signers: 2
};

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
