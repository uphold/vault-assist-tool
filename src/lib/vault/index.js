import './constants';
import {
  TransactionService,
  ValidationUtils,
  Blockchain as VaultBlockchain,
  WalletService
} from 'vault-wallet-toolkit';
import { Wallet } from 'vault-wallet-toolkit/lib/core/Wallet';
import {
  buildTransaction,
  getAccountReserve,
  getLedgerReserve,
  getBalance as getXrpBalance,
  getAccountSigners as getXrpSigners,
  sendTransaction as sendXrplTransaction,
  multisigner as xrplMultiSigner
} from './xrpl-provider';
import { translate } from '../../lib/i18n';

// eslint-disable-next-line no-process-env
const { NODE_ENV } = process.env;

export const Blockchain = VaultBlockchain;
export const { validateAddress, validateMnemonic } = ValidationUtils;
export const { signTransaction } = WalletService;

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
      return NODE_ENV === 'production'
        ? `https://livenet.xrpl.org/transactions/${hash}`
        : `https://testnet.xrpl.org/transactions/${hash}`;
    default:
      break;
  }
};

export const getAddress = (blockchain, key) => new Wallet(blockchain, key).address;

export const isKeySigner = (blockchain, key, signers) => signers.includes(getAddress(blockchain, key));

export const sendTransaction = async (blockchain, transaction) => {
  switch (blockchain) {
    case Blockchain.XRPL:
      return await sendXrplTransaction(transaction);

    default:
      return TransactionService.sendTransaction(blockchain, transaction);
  }
};

export const createTransaction = async (blockchain, data) => {
  switch (blockchain) {
    case Blockchain.XRPL:
      return await buildTransaction(data);

    default:
      return TransactionService.createTransaction(blockchain, data);
  }
};

export const multiSignTransaction = (blockchain, transaction, keys) => {
  switch (blockchain) {
    case Blockchain.XRPL:
      return xrplMultiSigner(transaction, keys);

    default:
      throw new Error(translate('messages.error.unsupported.blockchain'));
  }
};

export const getSigners = async (blockchain, address) => {
  switch (blockchain) {
    case Blockchain.XRPL:
      return await getXrpSigners(address);

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
};

export const getBalance = async (blockchain, address) => {
  switch (blockchain) {
    case Blockchain.XRPL:
      return await getXrpBalance(address);

    default:
      throw new Error(translate('messages.error.unsupported.blockchain'));
  }
};
