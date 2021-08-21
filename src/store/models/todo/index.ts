import {
  Action,
  Thunk,
  action,
  thunk,
} from 'easy-peasy'
import {
  getContractAddress,
  getInstance,
  getSelectedAddress,
} from './helper'
import { ethers } from 'ethers'
import { Todo } from '../../../artifacts/typechain'

const {
  formatBytes32String,
  formatEther,
  parseBytes32String,
  parseEther,
} = ethers.utils

export interface Item {
  id: ethers.BigNumber
  title: string
  assignee: string
  owner: string
  price: ethers.BigNumber
  priceInEth: string
  status: number
  isAssignee: boolean
  isOwner: boolean
}

interface NewItem {
  title: string
  assignee: string
  priceInEth: string
}

export interface TodoModel {
  loading: boolean
  error: boolean
  items: Item[],
  contractAddress: string
  selectedAddress: string
  isSameAddress: (a1: string, a2: string) => boolean
  setLoading: Action<TodoModel, boolean>
  setError: Action<TodoModel, boolean>
  setContractAddress: Action<TodoModel, string>
  setSelectedAddress: Action<TodoModel, string>
  setItems: Action<TodoModel, Item[]>
  addItem: Thunk<TodoModel, NewItem, any, {}, Promise<void>>
  completeItem: Thunk<TodoModel, ethers.BigNumber, any, {}, Promise<void>>
  confirmItem: Thunk<TodoModel, ethers.BigNumber, any, {}, Promise<void>>
  deleteItem: Thunk<TodoModel, ethers.BigNumber, any, {}, Promise<void>>
  getItems: Thunk<TodoModel>
  getInstance: Thunk<TodoModel, boolean | undefined, any, {}, Promise<Todo>>
  initialize: Thunk<TodoModel>
  performTransaction: Thunk<TodoModel, (todo: Todo) => Promise<ethers.ContractTransaction>, any, {}, Promise<void>>
}

const isSameAddress = (addr1: string, addr2: string) =>
  addr1.toLowerCase() === addr2.toLowerCase()

const todoModel: TodoModel = {
  loading: true,
  error: false,
  items: [],
  contractAddress: '',
  selectedAddress: '',
  isSameAddress,
  setLoading: action((state, payload) => {
    state.loading = payload
  }),
  setError: action((state, payload) => {
    state.error = payload
  }),
  setItems: action((state, payload) => {
    state.items = payload
  }),
  setContractAddress: action((state, payload) => {
    state.contractAddress = payload
  }),
  setSelectedAddress: action((state, payload) => {
    state.selectedAddress = payload
  }),
  addItem: thunk(async (actions, payload) => {
    await actions.performTransaction(todo =>
      todo.addItem(
        formatBytes32String(payload.title),
        parseEther(payload.priceInEth),
        payload.assignee,
      )
    )
  }),
  completeItem: thunk(async(actions, payload) => {
    await actions.performTransaction(todo =>
      todo.completeItem(payload)
    )
  }),
  confirmItem: thunk(async(actions, payload, { getState}) => {

    const items = getState().items
    const found = items.find(entry =>
      entry.id.toString() === payload.toString()
    )

    if (found) {
      await actions.performTransaction(todo =>
        todo.confirmItem(payload, {
          value: parseEther(found.priceInEth)
        })
      )
    }
  }),
  deleteItem: thunk(async(actions, payload) => {
    await actions.performTransaction(todo =>
      todo.deleteItem(payload)
    )
  }),
  getItems: thunk(async (actions, _payload, { getState }) => {
    const todo = await actions.getInstance(true)
    const { selectedAddress } = getState()
    const items = await todo.getItemsAtAddress(selectedAddress)

    const parsed = items
      .map(entry => ({
        ...entry,
        title: parseBytes32String(entry.title),
        priceInEth: formatEther(entry.price),
        isOwner: isSameAddress(selectedAddress, entry.owner),
        isAssignee: isSameAddress(selectedAddress, entry.assignee),
      }))

    actions.setItems(parsed)
  }),
  getInstance: thunk(async (_actions, payload, { getState }) => {
    const instance = await getInstance(getState().contractAddress, payload)

    return instance
  }),
  initialize: thunk(async actions => {
    try {
      actions.setLoading(true)

      const [
        contractAddress,
        selectedAddress,
      ] = await Promise.all([getContractAddress(), getSelectedAddress()])

      actions.setContractAddress(contractAddress)
      actions.setSelectedAddress(selectedAddress)

      await actions.getItems()

      actions.setLoading(false)
    } catch (e) {
      console.error('Error:', e)

      actions.setError(true)
    }
  }),
  performTransaction: thunk(async (actions, payload) => {
    const todo = await actions.getInstance(true)

    const transaction = await payload(todo)

    await transaction.wait()

    await actions.getItems()
  })
}

export default todoModel