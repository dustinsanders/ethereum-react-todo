const { ethers } = require('hardhat')

async function main() {
  const Todo = await ethers.getContractFactory('Todo')
  const todo = await Todo.deploy()

  console.log('Todo address:', todo.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })