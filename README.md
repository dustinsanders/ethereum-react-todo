# ethereum-react-todo

Simple todo contract and react front-end. Allows the connected address to create and assignee todo items. Assignee is able to complete and then get paid for items.

## Demo
Ropsten: [https://eth-todo.netlify.app](https://eth-todo.netlify.app)

Click [here](https://app.mycrypto.com/faucet) for testnet Ether

## Running locally
Install Dependencies
```console
yarn install
```

Run local hardhat node
```console
yarn start:localnode
```

Deploy locally and generate local config
```console
yarn deploy:local
```

Start React App & Netlify Functions
```console
yarn dev
```

Connect MetaMask to localhost network

## Tech Stack
* React
* Hardhat
* Ethers.js
* Evergreen UI
* Netlify Functions