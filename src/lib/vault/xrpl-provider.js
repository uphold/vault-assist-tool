import './constants';
import { Blockchain, WalletService } from 'vault-wallet-toolkit';
import { dropsToXrp, encode, multisign, xrpToDrops } from 'xrpl';
import { getXrplProvider } from 'vault-wallet-toolkit/lib/core/Xrpledger/XrplProvider';
import { multisigRequirements } from './network';
export { convertHexToString } from 'xrpl';
import BigNumber from 'bignumber.js';

const blockchain = Blockchain.XRPL;

export const transactionTypes = Object.freeze({
  AccountDelete: 'AccountDelete',
  Payment: 'Payment',
  TrustSet: 'TrustSet'
});

// signer requirements for multisig vault
const requirements = {
  signerEntries: multisigRequirements.entries,
  signerQuorum: multisigRequirements.signers
};

export const { signTransaction } = WalletService;

const signer = (key, tx) => signTransaction(blockchain, key, tx, { multisig: true });

export const multisigner = (tx, keys) => multisign(keys.map(key => signer(key, tx)));

export const getBalance = async address => {
  const { instance } = await getXrplProvider();

  return await instance.getXrpBalance(address);
};

const getServerInfo = async () => {
  const { instance } = await getXrplProvider();

  return await instance.request({ command: 'server_info' });
};

const getAccountInfo = async address => {
  const { instance } = await getXrplProvider();

  return await instance.request({ account: address, command: 'account_info', signer_lists: true });
};

const getTrustlines = async address => {
  const { instance } = await getXrplProvider();

  return await instance.request({ account: address, command: 'account_lines' });
};

export const getLedgerReserve = async () => {
  // current ledger reserve values
  const {
    result: {
      info: {
        validated_ledger: { reserve_base_xrp: baseReserve, reserve_inc_xrp: ownerReserve }
      }
    }
  } = await getServerInfo();

  return { baseReserve: new BigNumber(baseReserve).toString(), ownerReserve: new BigNumber(ownerReserve).toString() };
};

export const getAccountReserve = async address => {
  const { baseReserve, ownerReserve } = await getLedgerReserve();

  // number of account owners
  const {
    result: {
      account_data: { OwnerCount: ownerCount }
    }
  } = await getAccountInfo(address);

  // total reserve xrp on this account
  return new BigNumber(ownerCount).times(ownerReserve).plus(baseReserve).toString();
};

export const getAccountSigners = async address => {
  // get account signer list
  const {
    result: {
      account_data: { signer_lists: signerLists }
    }
  } = await getAccountInfo(address);

  if (signerLists.length > 0) {
    const [{ SignerEntries: signerEntries, SignerQuorum: signerQuorum }] = signerLists;

    if (signerQuorum === requirements.signerQuorum && signerEntries.length === requirements.signerEntries) {
      // convert into array of addresses
      return signerEntries.map(signerEntry => {
        const {
          SignerEntry: { Account: account }
        } = signerEntry;

        return account;
      });
    }
  }
};

export const getAccountTrustlines = async address => {
  // get account trustline list
  const {
    result: { lines }
  } = await getTrustlines(address);

  return lines;
};

export const getTransactionFee = async () => {
  const { instance } = await getXrplProvider();
  // current ledger reserve values
  const {
    result: {
      info: {
        load_factor,
        validated_ledger: { base_fee_xrp }
      }
    }
  } = await getServerInfo();

  return new BigNumber(base_fee_xrp).times(load_factor).times(instance.feeCushion).toString();
};

export const buildTransaction = async ({
  to,
  from,
  fee,
  destinationTag,
  transactionType,
  limitAmount,
  amount,
  queued = 0,
  signerCounts = requirements.signerQuorum
}) => {
  const { instance } = await getXrplProvider();

  // Closing account or sending payments require "to"
  // Trust lines require "limitAmount" of { currency, issuer, value }
  const baseParams = {
    Account: from,
    Destination: to,
    DestinationTag: destinationTag,
    Fee: fee ? xrpToDrops(fee) : undefined,
    LimitAmount: limitAmount,
    TransactionType: transactionType
  };

  // Amount is either XRP, or specific token
  const paymentParams = amt => {
    if (!amt) {
      return {};
    }

    switch (typeof amt) {
      case 'string':
        return { Amount: xrpToDrops(amt) };

      default:
        return {
          Amount: {
            currency: amt.currency,
            issuer: amt.issuer,
            value: amt.value
          },
          // tfPartialPayment flag --> https://xrpl.org/docs/references/protocol/transactions/types/payment#payment-flags
          Flags: 131072
        };
    }
  };

  // tfClearFreeze & tfSetNoRipple flag --> https://xrpl.org/docs/references/protocol/transactions/types/trustset#trustset-flags
  const trustFlags = transactionType === transactionTypes.TrustSet ? { Flags: 2228224 } : {};

  const autofilled = await instance.autofill({ ...baseParams, ...paymentParams(amount), ...trustFlags }, signerCounts);
  const { Sequence: sequence } = autofilled;

  return encode({ ...autofilled, Sequence: sequence + queued });
};

export const sendTransaction = async transaction => {
  const { instance } = await getXrplProvider();

  const {
    result: {
      Account: from,
      Destination: to,
      DestinationTag: destinationTag,
      hash,
      TransactionType: transactionType,
      meta: { delivered_amount: amount }
    }
  } = await instance.submitAndWait(transaction);

  return {
    amount: typeof amount === 'string' ? dropsToXrp(amount) : amount,
    destinationTag,
    from,
    hash,
    network: blockchain,
    to,
    transactionType
  };
};
