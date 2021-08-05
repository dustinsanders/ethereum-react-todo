import { useCallback, useEffect } from 'react'
import { addItem, getItems} from './helper'
import { createGlobalState } from 'react-use'

const initialState = {
  loading: true,
  items: null,
}

const useTodoState = createGlobalState(() => initialState)

const useTodoContract =  () => {
  const [state, setState] = useTodoState()
  const { items, loading } = state

  const updateState = useCallback(delta => setState({
    ...state,
    ...delta,
  }), [state, setState])


  useEffect(() => {
    if (items === null) {
      updateState({ loading: true })
      getItems(value => updateState({
        items: value,
        loading: false,
      }))
    }
  }, [])

  return {
    addItem: async ({ title, price, assignee }) =>
      addItem(
        { title, price, assignee },
        value => updateState({ items: value }),
      ),
    items,
    loading,
  }
}

export default useTodoContract