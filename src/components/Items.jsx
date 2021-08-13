import { Pane, Text } from 'evergreen-ui'
import React from 'react'
import Item from './Item'
import useTodoContract from '../hooks/useTodoContract'

const Items = () => {
  const { items } = useTodoContract()

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

  return items.map(item => (
    <Item key={item.id.toString()} {...item} />
  ))
}

export default Items