import { Pane, Text } from 'evergreen-ui'
import Item from './Item'
import { useStoreState } from '../store/hooks'

const Items = () => {
  const { items } = useStoreState(state => state.todo)

  if (!items.length) {
    return (
      <Pane
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontStyle="italic">No Items Found for Selected Address!</Text>
      </Pane>
    )
  }

  return (
    <>
      {
        items.map(item => (
          <Item key={item.id.toString()} {...item} />
        ))
      }
    </>
  )
}

export default Items