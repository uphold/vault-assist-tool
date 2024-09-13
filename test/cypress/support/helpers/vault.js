/*eslint-disable import/no-unresolved */
import { Blockchain, createWallet } from 'vault-wallet-toolkit';
import { Network, setNetwork } from '../../../../src/lib/vault/network';
import {
  getAccountReserve,
  getAccountTrustlines,
  getBalance,
  getLedgerReserve
} from '../../../../src/lib/vault/xrpl-provider';
import { getAddress } from '../../../../src/lib/vault';
import { getXrplProvider } from '../../../../src/lib/vault/clients/xrpl/xrpl-client';

const defaultBlockchain = Blockchain.XRPL;

setNetwork(Network.DEVELOPMENT);

const createWallets = numberOfWallets => {
  return [...Array(numberOfWallets)].map(() => {
    return createWallet();
  });
};

const parseWallet = wallet => ({ address: getAddress(defaultBlockchain, wallet.mnemonic), key: wallet.mnemonic });

const buildSignerListEntries = signerList =>
  signerList.map(({ address }) => ({
    SignerEntry: {
      Account: address,
      SignerWeight: 1
    }
  }));

const createVaultTestWallets = async () => {
  const { instance } = await getXrplProvider();

  //Fund a new vault wallet from faucet
  const faucet = await instance.fundWallet();
  const vaultWallet = faucet.wallet;
  const vaultAddress = vaultWallet.address;

  //Fund a destination wallet for testing
  const destinationFaucet = await instance.fundWallet();
  const destinationWallet = destinationFaucet.wallet;
  const destination = destinationWallet.address;

  const signerWallets = createWallets(3).map(wallet => parseWallet(wallet));
  const signerListEntries = buildSignerListEntries(signerWallets);

  const transaction = {
    Account: vaultAddress,
    SignerEntries: signerListEntries,
    SignerQuorum: 2,
    TransactionType: 'SignerListSet'
  };

  await instance.submitAndWait(transaction, { autofill: true, wallet: vaultWallet });

  const { ownerReserve } = await getLedgerReserve();

  return {
    destination,
    ownerReserve,
    signerWallets,
    vaultAddress,
    vaultBalance: await getBalance(vaultAddress),
    vaultReserve: await getAccountReserve(vaultAddress)
  };
};

const createVaultAndTokenTestWallets = async () => {
  const { instance } = await getXrplProvider();

  //Fund a new vault wallet from faucet
  const faucet = await instance.fundWallet();
  const vaultWallet = faucet.wallet;
  const vaultAddress = vaultWallet.address;

  //Fund a destination wallet for testing
  const destinationFaucet = await instance.fundWallet();
  const destinationWallet = destinationFaucet.wallet;
  const destination = destinationWallet.address;

  const issuerFaucet = await instance.fundWallet();
  const issuerWallet = issuerFaucet.wallet;
  const issuerAddress = issuerWallet.address;
  const issuerCurrency = '534F4C4F00000000000000000000000000000000';
  const issuerTokenName = 'SOLO';

  //asfDefaultRipple
  await instance.submitAndWait(
    {
      Account: issuerAddress,
      SetFlag: 8,
      TransactionType: 'AccountSet'
    },
    { autofill: true, wallet: issuerWallet }
  );

  //vault trusts issuer
  await instance.submitAndWait(
    {
      Account: vaultAddress,
      LimitAmount: {
        currency: issuerCurrency,
        issuer: issuerAddress,
        value: '100000'
      },
      TransactionType: 'TrustSet'
    },
    { autofill: true, wallet: vaultWallet }
  );

  //destination trusts issuer
  await instance.submitAndWait(
    {
      Account: destination,
      LimitAmount: {
        currency: issuerCurrency,
        issuer: issuerAddress,
        value: '100000'
      },
      TransactionType: 'TrustSet'
    },
    { autofill: true, wallet: destinationWallet }
  );

  //issuer pays vault
  await instance.submitAndWait(
    {
      Account: issuerAddress,
      Amount: {
        currency: issuerCurrency,
        issuer: issuerAddress,
        value: '100000'
      },
      Destination: vaultAddress,
      TransactionType: 'Payment'
    },
    { autofill: true, wallet: issuerWallet }
  );

  const signerWallets = createWallets(3).map(wallet => parseWallet(wallet));
  const signerListEntries = buildSignerListEntries(signerWallets);

  const transaction = {
    Account: vaultAddress,
    SignerEntries: signerListEntries,
    SignerQuorum: 2,
    TransactionType: 'SignerListSet'
  };

  await instance.submitAndWait(transaction, { autofill: true, wallet: vaultWallet });

  const { ownerReserve } = await getLedgerReserve();

  return {
    destination,
    ownerReserve,
    signerWallets,
    tokenList: [
      {
        currency: issuerCurrency,
        issuer: issuerAddress,
        name: issuerTokenName
      }
    ],
    tokenName: issuerTokenName,
    trustlines: await getAccountTrustlines(vaultAddress),
    vaultAddress,
    vaultBalance: await getBalance(vaultAddress),
    vaultReserve: await getAccountReserve(vaultAddress)
  };
};

export default {
  createVaultAndTokenTestWallets,
  createVaultTestWallets
};
