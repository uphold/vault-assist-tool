# Uphold Vault Assist Tool

Web frontend for the Uphold Vault Assist tool.

---

## Description

The Uphold Vault Assist Tool allows you to safely withdraw funds from your Uphold Vault and transfer them to another wallet. This will require your Vault and Backup Keys in order to complete the transaction (network fees apply). At the end of the process the Vault will be deactivated and the address will be deleted.

This tool is available on the web at [https://uphold.github.io/vault-assist-tool](https://uphold.github.io/vault-assist-tool). Before using your keys, verify the URL is right and the lock icon indicates a secure connection.

### How to use

1. Select the Vault you wish to access (XRP, BTC...)
2. Enter your Vault address. This was emailed to you when you created the Vault. It is also available within the Uphold app.
3. If you selected BTC, you will also need to enter your BTC Output descriptor. It was emailed to you when you created the Vault.
4. Enter your Vault and Backup Key
5. Specify the destination address you wish to move funds.
6. Confirm and view transaction on chain


## Running Vault Assist Tool Locally

### Installing Dependencies

You must install these before you are able to run this locally:

```sh
yarn install
```

### Start local web server

After the dependencies are installed, you should be able to run the server:

```sh
yarn start
```

Then open a browser window at `http://127.0.0.1:3000/`

## Development and testing

The Uphold Vault Assist Tool is provided under the [MIT License](/LICENSE).

### Start development server

**Note**: You must install the dependencies as mentioned above before running this.

To run the local web server using [testnet](https://xrpl.org/parallel-networks.html):

```sh
yarn dev
```

You can run the local web server for Bitcoin [regtest mode](https://developer.bitcoin.org/examples/testing.html). This requires a local ElectrumX server with websockets enabled on port 50003 (ws://127.0.0.1:50003):

```sh
NET=local yarn dev
```

### Testing

To run the main e2e tests:

```sh
yarn e2e
```

There is also an additional e2e test which tests successful account closure. Be aware that this test takes >15 minutes to complete.

```sh
yarn e2e:optional
```

### Build

**Note:** There is a Github workflow which is used to deploy this to the web.

To build the package (output to `public` directory):

```sh
yarn build
```
