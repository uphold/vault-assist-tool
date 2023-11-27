# Uphold Vault Assist Tool

Web frontend for the Uphold Vault Assist tool.

---

## Description

The Uphold Vault Assist Tool allows you to safely withdraw funds from your Uphold Vault and transfer them to another wallet. This will require your Vault and Backup Keys in order to complete the transaction (network fees apply). At the end of the process the Vault will be deactivated and the address will be deleted.

This tool is available on the web at [https://uphold.github.io/vault-assist-tool](https://uphold.github.io/vault-assist-tool). Before using your keys, verify the URL is right and the lock icon indicates a secure connection.

### How to use

1. Select the Vault you wish to access (XRP, BTC...)
2. Enter your Vault address. This was emailed to you when you created the Vault. It is also available within the Uphold app.
3. Enter your Vault and Backup Key
4. Specify the destination address you wish to move funds.
5. Confirm and view transaction on chain

---

## Development

The Uphold Vault Assist Tool is provided under the [MIT License](/LICENSE).

### Install dependencies

To install the dependencies run:

```sh
yarn install
```

### Local Web Server

To run this package locally:

```sh
yarn start
```

**NOTE**: By default the local server uses [testnet](https://xrpl.org/parallel-networks.html) for development purposes.

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

**Note:** There is Github workflow is used to deploy this to the web.

To build the package (output to `public` directory):

```sh
yarn build
```
