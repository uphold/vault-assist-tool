import { Blockchain, WalletService } from 'vault-wallet-toolkit';
import { getAccountReserve, getBalance, getLedgerReserve } from '../../../../src/lib/vault/xrpl-provider';
import { getAddress } from '../../../../src/lib/vault';
import { getXrplProvider } from 'vault-wallet-toolkit/lib/core/Xrpledger/XrplProvider';

const defaultBlockchain = Blockchain.XRPL;

const createWallets = (numberOfWallets) => {
  return [...Array(numberOfWallets)].map(() => {
    return WalletService.createWalletMinimal();
  });
};

const parseWallet = (wallet) => ({ address: getAddress(defaultBlockchain, wallet.mnemonic), key: wallet.mnemonic });

const buildSignerListEntries = (signerList) =>
  signerList.map(({ address }) => ({
    SignerEntry: {
      Account: address,
      SignerWeight: 1,
    },
  }));

const createVaultTestWallets = async () => {
  const { instance } = await getXrplProvider();

  //Fund a new vault wallet from faucet
  const faucet = await instance.fundWallet();
  const vaultWallet = faucet.wallet;
  const vaultAddress = vaultWallet.address;

  const signerWallets = createWallets(3).map((wallet) => parseWallet(wallet));
  const signerListEntries = buildSignerListEntries(signerWallets);

  const transaction = {
    Account: vaultAddress,
    SignerEntries: signerListEntries,
    SignerQuorum: 2,
    TransactionType: 'SignerListSet',
  };

  await instance.submitAndWait(transaction, { autofill: true, wallet: vaultWallet });

  const { ownerReserve } = await getLedgerReserve();

  //Use blackhole destination: https://xrpl.org/addresses.html#special-addresses
  const destination = 'rrrrrrrrrrrrrrrrrNAMEtxvNvQ';

  return {
    destination,
    ownerReserve,
    signerWallets,
    vaultAddress,
    vaultBalance: await getBalance(vaultAddress),
    vaultReserve: await getAccountReserve(vaultAddress),
  };
};

export default {
  createVaultTestWallets,
};
