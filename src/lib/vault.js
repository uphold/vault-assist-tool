import { CryptoUtils } from 'vault-wallet-toolkit/lib/utils/CryptoUtils';
import {
  TransactionService,
  ValidationUtils,
  Blockchain as VaultBlockchain,
  WalletService,
} from 'vault-wallet-toolkit';
import { getXrplProvider } from 'vault-wallet-toolkit/lib/core/Xrpledger/XrplProvider';

export const Blockchain = VaultBlockchain;

export const validateAddress = (blockchain, address) => {
  return ValidationUtils.validateAddress(blockchain, address);
};

export const createTransaction = async (blockchain, transactionData) => {
  return await TransactionService.createTransaction(blockchain, transactionData);
};

export const getBalance = async (blockchain, address) => {
  const { instance: xrplProvider } = await getXrplProvider();

  switch (blockchain) {
    case Blockchain.XRPL:
      return await xrplProvider.getXrpBalance(address);

    default:
      throw new Error('Unsupported blockchain');
  }
};

export const getReserveBalances = async (blockchain, address) => {
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

    // get account owner count
    const {
      result: {
        account_data: { OwnerCount: ownerCount },
      },
    } = await xrplProvider.request({ account: address, command: 'account_info' });

    // calculate account's total reserve balance
    const totalReserve = baseReserve + ownerCount * ownerReserve;

    return { baseReserve, ownerReserve, totalReserve };
  }
  throw new Error('Unsupported blockchain');
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
