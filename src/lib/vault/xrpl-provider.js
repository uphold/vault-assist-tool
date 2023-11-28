import './constants';
import { Blockchain, WalletService } from 'vault-wallet-toolkit';
import { dropsToXrp, encode, multisign, xrpToDrops } from 'xrpl';
import { getXrplProvider } from 'vault-wallet-toolkit/lib/core/Xrpledger/XrplProvider';

const blockchain = Blockchain.XRPL;

// signer requirements for multisig vault
const requirements = {
  signerEntries: 3,
  signerQuorum: 2
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

export const getLedgerReserve = async () => {
  // current ledger reserve values
  const {
    result: {
      info: {
        validated_ledger: { reserve_base_xrp: baseReserve, reserve_inc_xrp: ownerReserve }
      }
    }
  } = await getServerInfo();

  return { baseReserve, ownerReserve };
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
  return baseReserve + ownerCount * ownerReserve;
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

export const buildTransaction = async ({
  to,
  from,
  fee,
  destinationTag,
  transactionType,
  signerCounts = requirements.signerQuorum
}) => {
  const { instance } = await getXrplProvider();

  return encode(
    await instance.autofill(
      {
        Account: from,
        Destination: to,
        DestinationTag: destinationTag,
        Fee: xrpToDrops(fee),
        TransactionType: transactionType
      },
      signerCounts
    )
  );
};

export const sendTransaction = async transaction => {
  const { instance } = await getXrplProvider();

  const {
    result: {
      Account: from,
      Destination: to,
      DestinationTag: destinationTag,
      hash,
      meta: { DeliveredAmount: amount }
    }
  } = await instance.submitAndWait(transaction);

  return { amount: dropsToXrp(amount), destinationTag, from, hash, network: blockchain, to };
};
