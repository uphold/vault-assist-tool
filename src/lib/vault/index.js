import './constants';
import { Network, getNetworkEnv } from './network';
import { SupportedBlockchain as VaultBlockchain, validateAddress as validateVaultAddress } from 'vault-wallet-toolkit';
import { Wallet } from 'vault-wallet-toolkit/lib/core/Wallet';
import { bitcoinProvider } from './btc-provider';
import {
  convertHexToString,
  buildTransaction as createXrplTransaction,
  getAccountReserve,
  getAccountTrustlines,
  getLedgerReserve,
  getBalance as getXrpBalance,
  getAccountSigners as getXrpSigners,
  getTransactionFee as getXrpTransactionFee,
  sendTransaction as sendXrplTransaction,
  multisigner as xrplMultiSigner,
  transactionTypes as xrplTransactionTypes
} from './xrpl-provider';
import { hederaProvider } from './hedera-provider';
import { translate } from '../../lib/i18n';
import { tokens as xrplMainnetTokens } from './xrpl-tokenlist-mainnet.json';
import { tokens as xrplTestnetTokens } from './xrpl-tokenlist-testnet.json';
export { validateMnemonic, signTransaction } from 'vault-wallet-toolkit';
export { DEFAULT_MULTISIG_SIGNERS_REQUIRED } from './network';

export const Blockchain = VaultBlockchain;
export const transactionTypes = Object.freeze({
  [Blockchain.XRPL]: xrplTransactionTypes,
  [Blockchain.BTC]: {}
});

export const validateAddress = (network, address) => {
  if (network === Blockchain.HEDERA) {
    return /^(0|[1-9]\\d*)\.(0|[1-9]\\d*)\.((?:[0-9a-fA-F][0-9a-fA-F])+)[0-9a-fA-F]$/.test(address);
  }

  return validateVaultAddress(network, address, getNetworkEnv());
};

export const validateDescriptor = descriptor => {
  try {
    return bitcoinProvider.getSignersFromDescriptor(descriptor).length;
  } catch {
    return false;
  }
};

export const getCurrency = currency => {
  switch (currency) {
    case Blockchain.XRPL:
      return 'XRP';
    case Blockchain.BTC:
      return 'BTC';
    case Blockchain.HEDERA:
      return 'HBAR';
    default:
      // use for XRPL tokens to convert from hex
      return /^[A-F0-9]+$/i.test(currency) ? convertHexToString(currency).replace(/[^\x20-\x7E]/g, '') : currency;
  }
};

export const getTransactionLink = (blockchain, hash) => {
  switch (blockchain) {
    case Blockchain.XRPL:
      return getNetworkEnv() === Network.PRODUCTION
        ? `https://livenet.xrpl.org/transactions/${hash}`
        : `https://testnet.xrpl.org/transactions/${hash}`;
    case Blockchain.BTC:
      return getNetworkEnv() === Network.PRODUCTION
        ? `https://mempool.space/tx/${hash}`
        : `https://mempool.space/testnet/tx/${hash}`;
    case Blockchain.HEDERA:
      return getNetworkEnv() === Network.PRODUCTION
        ? `https://hashscan.io/mainnet/transaction/${hash}`
        : `https://hashscan.io/testnet/transaction/${hash}`;
    default:
      break;
  }
};

export const getAddress = (blockchain, key) => {
  switch (blockchain) {
    case Blockchain.XRPL:
      return new Wallet(blockchain, key).address;
    case Blockchain.BTC:
      return new Wallet(blockchain, key, "m/84'/0'/0'/0/0").address;
    case Blockchain.HEDERA:
      return new Wallet(blockchain, key).publicKey;
    default:
      break;
  }
};

export const getFee = async (blockchain, from) => {
  switch (blockchain) {
    case Blockchain.XRPL:
      return await getXrpTransactionFee();
    case Blockchain.BTC:
      return await bitcoinProvider.calculateTransactionFee(from);
    case Blockchain.HEDERA:
      return await hederaProvider.getFee();
    default:
      return '0';
  }
};

export const isKeySigner = (blockchain, key, signers) => {
  switch (blockchain) {
    case Blockchain.XRPL:
      return signers.includes(getAddress(blockchain, key));
    case Blockchain.BTC:
      return signers.includes(getAddress(blockchain, key));
    case Blockchain.HEDERA:
      return signers.includes(getAddress(blockchain, key));
    default:
      throw new Error(translate('messages.error.unsupported.blockchain'));
  }
};

export const sendTransaction = async (blockchain, transaction, destinationData) => {
  switch (blockchain) {
    case Blockchain.XRPL:
      return await sendXrplTransaction(transaction);
    case Blockchain.BTC:
      return await bitcoinProvider.sendTransaction(transaction, destinationData);
    case Blockchain.HEDERA:
      return await hederaProvider.sendTransaction(transaction, destinationData);
    default:
      throw new Error(translate('messages.error.unsupported.blockchain'));
  }
};

export const createTransaction = async (blockchain, data) => {
  try {
    switch (blockchain) {
      case Blockchain.XRPL:
        return await createXrplTransaction(data);
      case Blockchain.BTC:
        return await bitcoinProvider.createTransaction(data);
      case Blockchain.HEDERA:
        return await hederaProvider.createTransaction(data);
      default:
        throw new Error(translate('messages.error.unsupported.blockchain'));
    }
  } catch (error) {
    console.error(error?.message);
    throw new Error(translate('messages.error.default'));
  }
};

export const processTransactionResponses = (blockchain, responses, destinationData) => {
  if (blockchain === Blockchain.XRPL) {
    return {
      ...destinationData,
      hash: responses[0].hash,
      network: blockchain
    };
  }
};

export const multiSignTransaction = (blockchain, transaction, keys) => {
  switch (blockchain) {
    case Blockchain.XRPL:
      return xrplMultiSigner(transaction, keys);
    case Blockchain.BTC:
      return bitcoinProvider.multiSignTransaction(transaction, keys);
    case Blockchain.HEDERA:
      return hederaProvider.multiSignTransaction(transaction, keys);
    default:
      throw new Error(translate('messages.error.unsupported.blockchain'));
  }
};

export const getSigners = async (blockchain, address, descriptor) => {
  switch (blockchain) {
    case Blockchain.XRPL:
      return await getXrpSigners(address);
    case Blockchain.BTC:
      if (bitcoinProvider.deriveMultisigAddress(descriptor) !== address) {
        throw new Error(translate('withdraw.btc.destination.fields.address.errors.invalid.btc'));
      }

      return bitcoinProvider.getSignersFromDescriptor(descriptor);
    case Blockchain.HEDERA:
      return await hederaProvider.getAccountKeys(address);
    default:
      throw new Error(translate('messages.error.unsupported.blockchain'));
  }
};

export const getReserves = async (blockchain, address) => {
  if (blockchain === Blockchain.XRPL) {
    const { baseReserve, ownerReserve } = await getLedgerReserve();
    const totalReserve = await getAccountReserve(address);

    return { baseReserve, ownerReserve, totalReserve };
  }

  // there are no reserves on other blockchains
  return { baseReserve: '0', ownerReserve: '0', totalReserve: '0' };
};

export const getBalance = async (blockchain, address) => {
  switch (blockchain) {
    case Blockchain.XRPL:
      try {
        return await getXrpBalance(address);
      } catch {
        return '0';
      }
    case Blockchain.BTC:
      return await bitcoinProvider.getAddressBalance(address);
    case Blockchain.HEDERA:
      return await hederaProvider.getBalance(address);
    default:
      throw new Error(translate('messages.error.unsupported.blockchain'));
  }
};

export const getTokenFromTrustline = (trustlines, token) =>
  token && trustlines.find(({ account, currency }) => account === token?.issuer && currency === token?.currency);

export const getTrustlines = async (blockchain, address) => {
  if (blockchain === Blockchain.XRPL) {
    return await getAccountTrustlines(address);
  }

  return [];
};

export const getTokenList = blockchain => {
  if (blockchain === Blockchain.XRPL) {
    switch (getNetworkEnv()) {
      case Network.PRODUCTION:
        return xrplMainnetTokens;
      case Network.DEVELOPMENT:
        // eslint-disable-next-line no-case-declarations
        const testTokenList = JSON.parse(localStorage.getItem('testTokenList'));

        // Use generated list when running e2e tests
        if (testTokenList) {
          return testTokenList;
        }

        return xrplTestnetTokens;
      default:
        return [];
    }
  }
};
