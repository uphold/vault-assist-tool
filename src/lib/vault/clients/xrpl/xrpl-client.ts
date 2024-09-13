import { Blockchain, Network, getNetwork } from 'vault-wallet-toolkit';
import { Client } from 'xrpl';

const xrplPeersMap = {
  [Network.PRODUCTION]: ['wss://xrplcluster.com', 'wss://s1.ripple.com', 'wss://s2.ripple.com'],
  [Network.DEVELOPMENT]: ['wss://testnet.xrpl-labs.com', 'wss://s.altnet.rippletest.net:51233'],
  [Network.LOCAL]: []
};

export class XrplProvider {
  instance!: Client;
  peers: string[] = xrplPeersMap[getNetwork<Network>(Blockchain.XRPL)];

  constructor() {
    this.createInstanceWithRandomPeer();
  }

  async connect(): Promise<void> {
    try {
      await this.instance.connect();
    } catch (err: any) {
      this.createInstanceWithRandomPeer();
      await this.connect();
    }
  }

  private createInstanceWithRandomPeer() {
    if (this.peers.length === 0) {
      this.peers = xrplPeersMap[getNetwork<Network>(Blockchain.XRPL)];
      throw new Error('Cannot connect to provider');
    }
    const randomPeerIndex = Math.floor(Math.random() * this.peers.length);
    const randomPeer = this.peers[randomPeerIndex];

    this.peers.splice(randomPeerIndex, 1);
    this.instance = new Client(randomPeer);
  }

  async disconnect(): Promise<void> {
    await this.instance.disconnect();
  }

  get isConnected(): boolean {
    return this.instance.isConnected();
  }
}

let xrplProvider: XrplProvider;

export const getXrplProvider = async () => {
  if (!xrplProvider) {
    xrplProvider = new XrplProvider();
  }

  if (!xrplProvider.isConnected) {
    await xrplProvider.connect();
  }

  return xrplProvider;
};
