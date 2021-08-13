import { ethers } from 'ethers'
import Todo from '../../artifacts/contracts/Todo.sol/Todo.json'

const {
  formatBytes32String,
  formatEther,
  parseBytes32String,
  parseEther,
} = ethers.utils

let address = null
const defaultTodoAddress = "0x2417A0995dd4929F1466dc65710B8338d3252cb8"

const initAddress = async () => {
  try {
    const response = await fetch('/.netlify/functions/address')
    const { value } = await response.json()

    address = value
  } catch (e) {
    console.error(e)

    address = defaultTodoAddress
  }
}

const getTodoInstance = (withSigner = false) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    return new ethers.Contract(
      address,
      Todo.abi,
      withSigner ?  provider.getSigner() : provider,
    )
  } catch (e) {
    console.log('error', e)
  }
}

const isSameAddress = (addr1, addr2) =>
  addr1.toLowerCase() === addr2.toLowerCase()

const getItems = async selectedAddress => {
  const todo = getTodoInstance()
  const items = await todo.getItems()

  return items
    .map(entry => ({
      ...entry,
      title: parseBytes32String(entry.title),
      priceInEth: formatEther(entry.price),
      isOwner: isSameAddress(selectedAddress, entry.owner),
      isAssignee: isSameAddress(selectedAddress, entry.assignee),
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

const completeItem = async id =>
  performTransaction(async todo => todo.completeItem(id))

const confirmItem = async (id, price) =>
  performTransaction(async todo => todo.confirmItem(id, { value: price }))

const deleteItem = async (id) =>
  performTransaction(async todo => todo.deleteItem(id))

const contract = {
  addItem,
  completeItem,
  confirmItem,
  deleteItem,
  getItems,
  initAddress,
  isSameAddress,
}

export default contract