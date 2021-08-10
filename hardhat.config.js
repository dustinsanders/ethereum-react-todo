require('@nomiclabs/hardhat-waffle')
require('dotenv').config()

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.1',
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    testnet: {
      url: process.env.ALCHEMY_URL,
      accounts: [`0x${process.env.METAMASK_PRIVATE_KEY}`],
    },
    hardhat: {
      chainId: 1337,
    }
  },
}
