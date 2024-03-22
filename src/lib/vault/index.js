import './constants';
import { Network, getNetworkEnv } from './network';
import { ValidationUtils, Blockchain as VaultBlockchain, WalletService } from 'vault-wallet-toolkit';
import { Wallet } from 'vault-wallet-toolkit/lib/core/Wallet';
import { bitcoinProvider } from './btc-provider';
import {
  buildTransaction as createXrplTransaction,
  getAccountReserve,
  getLedgerReserve,
  getBalance as getXrpBalance,
  getAccountSigners as getXrpSigners,
  sendTransaction as sendXrplTransaction,
  multisigner as xrplMultiSigner
} from './xrpl-provider';
import { translate } from '../../lib/i18n';

export const Blockchain = VaultBlockchain;
export const { validateMnemonic } = ValidationUtils;
export const { signTransaction } = WalletService;

export const validateAddress = (network, address) => {
  return ValidationUtils.validateAddress(network, address, getNetworkEnv());
};

export const validateDescriptor = descriptor => {
  try {
    return bitcoinProvider.getSignersFromDescriptor(descriptor).length;
  } catch {
    return false;
  }
};

export const getCurrency = blockchain => {
  switch (blockchain) {
    case Blockchain.XRPL:
      return 'XRP';
    case Blockchain.BTC:
      return 'BTC';
    default:
      break;
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
    default:
      break;
  }
};

export const getFee = async (blockchain, from) => {
  if (blockchain === Blockchain.BTC) {
    return await bitcoinProvider.calculateTransactionFee(from);
  }

  return 0;
};

export const isKeySigner = (blockchain, key, signers) => {
  switch (blockchain) {
    case Blockchain.XRPL:
      return signers.includes(getAddress(blockchain, key));
    case Blockchain.BTC:
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
      default:
        throw new Error(translate('messages.error.unsupported.blockchain'));
    }
  } catch (error) {
    console.error(error?.message);
    throw new Error(translate('messages.error.default'));
  }
};

export const multiSignTransaction = (blockchain, transaction, keys) => {
  switch (blockchain) {
    case Blockchain.XRPL:
      return xrplMultiSigner(transaction, keys);
    case Blockchain.BTC:
      return bitcoinProvider.multiSignTransaction(transaction, keys);
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
  return { baseReserve: 0, ownerReserve: 0, totalReserve: 0 };
};

export const getBalance = async (blockchain, address) => {
  switch (blockchain) {
    case Blockchain.XRPL:
      return await getXrpBalance(address);
    case Blockchain.BTC:
      return await bitcoinProvider.getAddressBalance(address);
    default:
      throw new Error(translate('messages.error.unsupported.blockchain'));
  }
};
