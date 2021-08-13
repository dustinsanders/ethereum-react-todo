const { ethers } = require('hardhat')
const fs = require('fs')
const get = require('lodash/get')
const path = require('path')

const configPath = path.resolve(__dirname, '../src/functions/config')

const writeFile = (address, networkName) => {
  const isLocal = networkName === 'unknown'
  const file = isLocal ? 'local.js' : 'testnet.js'
  const otherFile = isLocal ? 'testnet.js' : 'local.js'
  const otherPath = path.resolve(configPath, otherFile)

  if (!fs.existsSync(otherPath)) {
    fs.writeFileSync(
      otherPath,
      "module.exports = ''",
    )
  }

  fs.writeFileSync(
    path.resolve(configPath, file),
    `module.exports = '${address}'`,
  )
}

async function main() {
  const [deployer] = await ethers.getSigners()

  console.log('Deploying contracts with the account:', deployer.address)
  console.log('Account balance:', (await deployer.getBalance()).toString())

  const Todo = await ethers.getContractFactory('Todo')
  const todo = await Todo.deploy()

  const networkName = get(deployer, 'provider._network.name')
  writeFile(todo.address, networkName)

  console.log('Todo address:', todo.address)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })