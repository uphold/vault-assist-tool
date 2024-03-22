import * as bitcoin from 'bitcoinjs-lib';
import {
  AddressTransaction,
  ElectrumTransaction,
  ElectrumUtxo,
  TransactionInput,
  TransactionOutput,
  txhexToElectrumTransaction
} from '../utils/electrum-utils';
import { addressToScripthash, btcToSats } from '../utils/bitcoin-utils';
import BigNumber from 'bignumber.js';
import ElectrumClient from '@codewarriorr/electrum-client-js'

// We can only use websocket servers in a web browser
const mainnetPeers = [
  { host: 'fulcrum.grey.pw', port: '50004' },
  { host: 'electrum.petrkr.net/btc', port: '443' },
  { host: 'e.keff.org', port: '50004' },
  { host: 'bitcoin.grey.pw', port: '50004' },
  { host: 'bitcoin.threshold.p2p.org', port: '50004' }
];

export interface BitcoinBalance {
  confirmed: number;
  unconfirmed: number;
}

export interface TxPos {
  height: number;
  tx_hash: string;
}

export interface Utxo {
  address: string;
  txid: string;
  hash: Buffer | string;
  vout: number;
  hex?: string;
  value: number;
}

export interface BitcoinClient {
  broadcastTransaction(hex: string): Promise<boolean>;
  getAddressBalance(address: string): Promise<BitcoinBalance>;
  getAddressUTXOs(address: string): Promise<Utxo[]>;
  isConnected(): Promise<boolean>;
  getTransaction(txid: string): Promise<any>;
  getTransactions(address: string, limit: number): Promise<any>;
  getBlockHeight(): number;
}

export class Electrum implements BitcoinClient {
  private client!: ElectrumClient;
  connected = false;
  public port!: string;
  public host!: string;
  currentPeerIndex = 0;
  public lastBlock = { height: 0, hex: '' };
  public network!: bitcoin.Network;
  socket = 'wss';
  keepAliveInterval = 75 * 1000;
  local = false;

  constructor(network: bitcoin.Network) {
    this.network = network;
    this.local = this.network === bitcoin.networks.regtest || this.network === bitcoin.networks.testnet;
    this.init();
  }

  async init(): Promise<void> {
    this.currentPeerIndex = Math.floor(Math.random() * mainnetPeers.length);
    this.port = mainnetPeers[this.currentPeerIndex].port;
    this.host = mainnetPeers[this.currentPeerIndex].host;
    if (this.local) {
      this.port = '50003';
      this.host = '127.0.0.1'
      this.socket = 'ws'
    }
    await this.connect();

    try {
      this.lastBlock = await this.client.blockchain_headers_subscribe();
      if (this.lastBlock) {
        this.connected = true;
      }
    } catch (error) {
      console.warn(`Header Subscribe error: ${error}`);
      this.connected = false;
    }
  }

  async connect(): Promise<void> {
    this.client = new ElectrumClient(this.host, this.port, this.socket);

    try {
      await this.client.connect();
      this.keepAlive();
    } catch (error) {
      console.error(`Error connecting to Electrum server: ${error}`);
      this.connected = false;
    }
  }

  async broadcastTransaction(hex: string): Promise<boolean> {
    if (!this.connected) {
      await this.init();
    }
    const res = await this.client.blockchain_transaction_broadcast(hex);

    return res === hex;
  }

  async estimateFee(rate: number): Promise<string> {
    if (!this.connected) {
      await this.init();
    }
    const fee = await this.client.blockchainEstimatefee(rate);

    return String(fee * 1e8 / 1000);
  }

  async getAddressBalance(address: string): Promise<BitcoinBalance> {
    if (!this.connected) {
      await this.init();
    }
    try {
      return await this.client.blockchain_scripthash_getBalance(addressToScripthash(address, this.network));
    } catch (error) {
      console.warn(`Electrum server getAddressBalance error: ${error}`);
    }

    return {
      confirmed: -1,
      unconfirmed: 0
    };
  }

  async getAddressUTXOs(address: string): Promise<Utxo[]> {
    if (!this.connected) {
      await this.init();
    }
    const result = await this.client.blockchain_scripthash_listunspent(addressToScripthash(address, this.network));

    const txhexPromises = result.map(async (unspent: ElectrumUtxo) => {
      const txDetails = await this.getTransaction(unspent.tx_hash);

      return {
        address,
        hash: unspent.tx_hash,
        hex: txDetails.hex,
        txid: txDetails.txid,
        value: unspent.value,
        vout: unspent.tx_pos
      };
    });

    return await Promise.all(txhexPromises);
  }

  async getTransactionDetails(txpos: TxPos): Promise<AddressTransaction> {
    if (!this.connected) {
      await this.init();
    }
    this.lastBlock = await this.client.blockchain_headers_subscribe();
    const tx = await this.getTransaction(txpos.tx_hash);
    let { confirmations, time } = tx;

    if (confirmations === 0 && txpos.height > 0) {
      confirmations = this.lastBlock.height - txpos.height;
    }

    if (!time) {
      if (txpos.height > 0) {
        // If we get here then we've probably got a transaction from an Esplora server,
        // which doesn't support verbose transactions and therefore doesn't have any
        // way of getting the blocktime for a transaction.
        // The solution is not to use Esplora servers...
        // Also the same thing on the
        // So for now hardcoding to current time
        time = Math.floor(Date.now() / 1000);
      } else {
        // Transaction is in the mempool
        time = Math.floor(Date.now() / 1000);
      }
    }

    const addressTransaction: AddressTransaction = {
      confirmations,
      fee: '0',
      hash: tx.txid,
      height: txpos.height,
      inputs: <TransactionInput[]>[],
      outputs: <TransactionOutput[]>[],
      time
    };

    let isCoinbase = false;

    for (const input of tx.vin) {
      if (input.coinbase) {
        isCoinbase = true;
        // If it's a coinbase tx, treat it as having no inputs
        break;
      }

      // Get each input's transaction
      const prevTxForVin = await this.getTransaction(input.txid);

      const prevOutput = prevTxForVin.vout[input.vout];

      if (prevTxForVin && prevTxForVin.vout && prevOutput) {
        let inputAddress = '';

        if (prevOutput.scriptPubKey) {
          if (prevOutput.scriptPubKey.address) {
            inputAddress = prevOutput.scriptPubKey.address;
          } else if (prevOutput.scriptPubKey.addresses) {
            [inputAddress] = prevOutput.scriptPubKey.addresses;
          }
        }

        const value = btcToSats(prevOutput.value);

        addressTransaction.fee = new BigNumber(addressTransaction.fee).plus(value).toString();
        addressTransaction.inputs.push({
          address: inputAddress,
          sequence: input.sequence,
          txid: input.txid,
          value,
          vout: input.vout
        });
      }
    }

    for (const output of tx.vout) {
      let outputAddress = '';

      if (output.scriptPubKey) {
        if (output.scriptPubKey.address) {
          outputAddress = output.scriptPubKey.address;
        } else if (output.scriptPubKey.addresses) {
          [outputAddress] = output.scriptPubKey.addresses;
        }
      }

      const value = btcToSats(output.value);

      if (!isCoinbase) {
        // Coinbase txs have 0 fee
        addressTransaction.fee = new BigNumber(addressTransaction.fee).minus(value).toString();
      }

      addressTransaction.outputs.push({ address: outputAddress, value });
    }

    return addressTransaction;
  }

  async getTransaction(txid: string): Promise<ElectrumTransaction> {
    if (!this.connected) {
      await this.init();
    }
    try {
      const txhex = await this.client.blockchain_transaction_get(txid);

      return txhexToElectrumTransaction(txhex);
    } catch (error) {
      console.warn(`Electrum server blockchain_transaction_get ${txid} error: ${error.message}`);
      throw new Error(`Error getting txid ${txid}: ${error.message}`);
    }
  }

  async getTransactions(address: string, limit: number): Promise<AddressTransaction[]> {
    if (!this.connected) {
      await this.init();
    }
    try {
      let history = await this.client.blockchain_scripthash_getHistory(addressToScripthash(address, this.network));

      history = history?.slice(-limit);

      return Promise.all(history.map((txpos: TxPos) => this.getTransactionDetails(txpos)));
    } catch (error) {
      console.warn(`Electrum cannot fetch transactions history: ${error?.message}`);

      return [];
    }
  }

  async isConnected(): Promise<boolean> {
    return this.connected;
  }

  async keepAlive() {
    setInterval(
      async () => {
        await this.client.server_ping()
          .catch(() => {
            this.connected = false;
          })
      },
      this.keepAliveInterval
    )
  }

  getBlockHeight(): number {
    return this.lastBlock.height;
  }
}
