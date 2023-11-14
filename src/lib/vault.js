import { CryptoUtils } from 'vault-wallet-toolkit/lib/utils/CryptoUtils';
import { I18n } from './i18n/provider';
import {
  Network,
  NetworkUtil,
  TransactionService,
  ValidationUtils,
  Blockchain as VaultBlockchain,
  WalletService,
} from 'vault-wallet-toolkit';
import { Wallet } from 'vault-wallet-toolkit/lib/core/Wallet';
import { getXrplProvider } from 'vault-wallet-toolkit/lib/core/Xrpledger/XrplProvider';

export const Blockchain = VaultBlockchain;

// Set testnet if we are on dev
NetworkUtil.setNetwork(__DEV__ ? Network.DEVELOPMENT : Network.PRODUCTION);

export const validateAddress = (blockchain, address) => {
  return ValidationUtils.validateAddress(blockchain, address);
};

export const validateMnemonic = (mnemonic) => {
  return ValidationUtils.validateMnemonic(mnemonic);
};

export const createTransaction = async (blockchain, transactionData) => {
  return await TransactionService.createTransaction(blockchain, transactionData);
};

export const validateVaultKeys = (blockchain, vaultKey, backupKey, signerList) => {
  if (vaultKey === backupKey) {
    return false;
  }

  const vaultWallet = new Wallet(blockchain, vaultKey);

  if (!signerList.includes(vaultWallet.address)) {
    return false;
  }

  const backupWallet = new Wallet(blockchain, backupKey);

  if (!signerList.includes(backupWallet.address)) {
    return false;
  }

  return true;
};

export const getBalance = async (blockchain, address) => {
  const { instance: xrplProvider } = await getXrplProvider();

  switch (blockchain) {
    case Blockchain.XRPL:
      return await xrplProvider.getXrpBalance(address);

    default:
      throw new Error(I18n.t('messages.error.unsupported.blockchain'));
  }
};

export const findSigners = (signerLists) => {
  try {
    const [{ SignerEntries: signerEntries, SignerQuorum: signerQuorum }] = signerLists;

    if (signerQuorum > 2) {
      throw new Error(I18n.t('messages.error.account.not.vault'));
    }

    return signerEntries.map((signerEntry) => {
      const {
        SignerEntry: { Account: account },
      } = signerEntry;

      return account;
    });
  } catch {
    throw new Error(I18n.t('messages.error.account.not.vault'));
  }
};

export const getAccountInfo = async (blockchain, address) => {
  const { instance: xrplProvider } = await getXrplProvider();

  if (blockchain === Blockchain.XRPL) {
    // get xrp-ledger base reserve values
    const {
      result: {
        info: {
          validated_ledger: { reserve_base_xrp: baseReserve, reserve_inc_xrp: ownerReserve },
        },
      },
    } = await xrplProvider.request({ command: 'server_info' });

    // get account owner count and signer info
    const {
      result: {
        account_data: { OwnerCount: ownerCount, signer_lists: signerLists },
      },
    } = await xrplProvider.request({ account: address, command: 'account_info', signer_lists: true });

    // calculate account's total reserve balance
    const totalReserve = baseReserve + ownerCount * ownerReserve;

    // get list of signers for reference
    const signerList = findSigners(signerLists);

    return { reserve: { baseReserve, ownerReserve, totalReserve }, signerList };
  }
  throw new Error(I18n.t('messages.error.unsupported.blockchain'));
};

export const isValidKey = (fingerprint, key) => {
  if (!key) {
    return false;
  }

  return CryptoUtils.getFingerprint(key) === fingerprint;
};

export const sendTransaction = async (blockchain, transaction) => {
  return await TransactionService.sendTransaction(blockchain, transaction);
};

export const signTransaction = (blockchain, transaction, mnemonic) => {
  return WalletService.signTransaction(blockchain, mnemonic, transaction, {
    multisig: true,
  });
};
