/* eslint-disable import/no-unresolved */
import './constants';
import {
  AccountBalanceQuery,
  AccountId,
  Client,
  Hbar,
  Transaction,
  TransactionId,
  TransferTransaction
} from '@hashgraph/sdk';
import { SupportedBlockchain as Blockchain, signTransaction } from 'vault-wallet-toolkit';
import { Network, getNetworkEnv } from './network';
import BigNumber from 'bignumber.js';

const blockchain = Blockchain.HEDERA;

const mirrorServer = getNetworkEnv() === Network.DEVELOPMENT ? `testnet` : `mainnet`;
const mirrorUrl = `${mirrorServer}.mirrornode.hedera.com:443`;

export class HederaProvider {
  client;
  fee;

  constructor() {
    this.client = getNetworkEnv() === Network.DEVELOPMENT ? Client.forTestnet() : Client.forMainnet();
    this.client.setMirrorNetwork(mirrorUrl);
    // this.fee = transfer fee in usd
    this.fee = '0.0001705';
    console.info(`Hedera network connected to ${this.client.ledgerId.toString()}`);
  }

  async createTransaction({ to, from, destinationMemo }) {
    const balance = await this.getBalance(from);
    const fee = await this.getFee();
    const available = new BigNumber(balance).minus(fee).dp(8);
    const amount = new Hbar(available);
    const transactionId = TransactionId.generate(from);

    const transaction = new TransferTransaction()
      .addHbarTransfer(from, amount.negated())
      .setNodeAccountIds([new AccountId(3)])
      .addHbarTransfer(to, amount)
      .setTransactionId(transactionId);

    if (destinationMemo) {
      transaction.setTransactionMemo(destinationMemo);
    }

    transaction.freezeWith(this.client);

    return transaction;
  }

  async getAccountInfo(accountId) {
    const endpoint = `https://${mirrorUrl}/api/v1/accounts?account.id=${accountId}&limit=1`;

    const result = await fetch(endpoint, {
      method: 'GET',
      redirect: 'follow'
    });

    if (result.status !== 200) {
      throw new Error(result.statusText);
    }

    const {
      accounts: [account]
    } = await result.json();

    return account;
  }

  async getAccountKeys(accountId) {
    const accountInfo = await this.getAccountInfo(accountId);

    if (accountInfo) {
      const { key: accountKey } = accountInfo;

      const { _type: keyType, key } = accountKey;

      if (keyType === 'ProtobufEncoded') {
        // proto keylist string containing signer public keys
        return key;
      }
    }
  }

  async getBalance(accountId) {
    const balance = await new AccountBalanceQuery().setAccountId(accountId).execute(this.client);

    return balance.hbars.toBigNumber().toString();
  }

  async getFee() {
    const endpoint = `https://${mirrorUrl}/api/v1/network/exchangerate`;

    const result = await fetch(endpoint, {
      method: 'GET',
      redirect: 'follow'
    });

    if (result.status !== 200) {
      throw new Error(result.statusText);
    }

    const {
      next_rate: { cent_equivalent, hbar_equivalent }
    } = await result.json();

    const price = new BigNumber(cent_equivalent).dividedBy(100).dividedBy(hbar_equivalent);
    const fee = new BigNumber(this.fee).dividedBy(price);

    return fee.toString();
  }

  multiSignTransaction(transaction, keys) {
    const tx = Buffer.from(transaction.toBytes()).toString('hex');

    let signedTx = tx;

    keys.forEach(key => {
      signedTx = signTransaction(blockchain, key, signedTx, { multisig: true });
    });

    return signedTx;
  }

  async sendTransaction(encodedTransaction, { to, amount }) {
    const decodedTx = Transaction.fromBytes(Buffer.from(encodedTransaction, 'hex'));

    const response = await decodedTx.execute(this.client);

    await response.getReceipt(this.client);

    return { amount, from: '', hash: decodedTx.transactionId.toString(), network: blockchain, to };
  }
}

export const hederaProvider = new HederaProvider();
