import { ethers } from 'ethers'
import Todo from '../../artifacts/contracts/Todo.sol/Todo.json'

const {
  formatBytes32String,
  formatEther,
  parseBytes32String,
  parseEther,
} = ethers.utils

const todoAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6"

const connectToMetaMask = async () =>
  window.ethereum.request({ method: 'eth_requestAccounts' })

const getTodoInstance = () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    return new ethers.Contract(todoAddress, Todo.abi, provider)
  } catch (e) {
    console.log('error', e)
  }
}

export const getItems = async setter => {
  const todo = getTodoInstance()
  const items = await todo.getItems()

  const parsed = items
    .map(entry => ({
      ...entry,
      title: parseBytes32String(entry.title),
      priceInEth: formatEther(entry.price),
    }))

  setter(parsed)
}

export const addItem = async ({ title, price, assignee }, setter) => {
  await connectToMetaMask()
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(todoAddress, Todo.abi, signer)

  console.log({ title, price, assignee })

  const transaction = await contract.addItem(
    formatBytes32String(title),
    parseEther(price),
    assignee,
  )

  await transaction.wait()
  await getItems(setter)
}