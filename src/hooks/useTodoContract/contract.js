import { ethers } from 'ethers'
import Todo from '../../artifacts/contracts/Todo.sol/Todo.json'

const {
  formatBytes32String,
  formatEther,
  parseBytes32String,
  parseEther,
} = ethers.utils

const todoAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

const getTodoInstance = (withSigner = false) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    return new ethers.Contract(
      todoAddress,
      Todo.abi,
      withSigner ?  provider.getSigner() : provider,
    )
  } catch (e) {
    console.log('error', e)
  }
}

const owner = async () => {
  const todo = getTodoInstance()
  const owner = await todo.owner()

  return owner
}

const getItems = async () => {
  const todo = getTodoInstance()
  const items = await todo.getItems()

  return items
    .map(entry => ({
      ...entry,
      title: parseBytes32String(entry.title),
      priceInEth: formatEther(entry.price),
    }))
}

const performTransaction = async operation => {
  const todo = await getTodoInstance(true)
  const transaction = await operation(todo)

  await transaction.wait()
}

const addItem = async ({ title, price, assignee }) =>
  performTransaction(async todo => todo.addItem(
    formatBytes32String(title),
    parseEther(price),
    assignee.toLowerCase(),
  ))

const completeItem = async idx =>
  performTransaction(async todo => todo.completeItem(idx))

const confirmItem = async (idx, price) =>
  performTransaction(async todo => todo.confirmItem(idx, { value: price }))

const deleteItem = async (idx) =>
  performTransaction(async todo => todo.deleteItem(idx))

const contract = {
  addItem,
  completeItem,
  confirmItem,
  deleteItem,
  getItems,
  owner,
}

export default contract