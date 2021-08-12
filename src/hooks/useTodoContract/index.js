import { useCallback } from 'react'
import { createGlobalState, useEffectOnce } from 'react-use'
import detectEthereumProvider from '@metamask/detect-provider'
import contract from './contract'
import get from 'lodash/get'

const initialState = {
  loading: true,
  items: null,
  owner: null,
  selectedAddress: null,
  error: false,
}

const useTodoState = createGlobalState(() => initialState)

const useTodoContract =  () => {
  const [state, setState] = useTodoState()

  const updateState = useCallback(delta => setState({
    ...state,
    ...delta,
  }), [state, setState])

  const initialize = useCallback(async () => {
    try {
      updateState({ loading: true })
      const provider = await detectEthereumProvider()

      await window.ethereum.request({ method: 'eth_requestAccounts' })

      window.ethereum.on('accountsChanged', (accounts) => {
        window.location.reload()
      })

      const [owner, items] = await Promise.all([
        contract.owner(),
        contract.getItems(),
      ])

      const selectedAddress = get(provider, 'selectedAddress', '')

      updateState({
        items,
        loading: false,
        owner,
        selectedAddress,
        isOwner: owner.toLowerCase() === selectedAddress.toLowerCase(),
      })
    } catch (e) {
      console.error(e)

      updateState({
        loading: false,
        error: true,
      })
    }

  }, [updateState])

  const makeRefetchItems = useCallback(
    action =>
      async (...args) => {
        await action(...args)
        const items = await contract.getItems()

        updateState({ items})
      },
    [updateState],
  )

  useEffectOnce(() => {
    if (state.items === null) {
      initialize()
    }
  })

  return {
    ...state,
    addItem: makeRefetchItems(contract.addItem),
    completeItem: makeRefetchItems(contract.completeItem),
    confirmItem: makeRefetchItems(contract.confirmItem),
    deleteItem: makeRefetchItems(contract.deleteItem),
  }
}

export default useTodoContract