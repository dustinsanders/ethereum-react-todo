import { Text } from 'evergreen-ui'
import React from 'react'
import Item from './Item'
import useTodoContract from '../hooks/useTodoContract'

const Items = () => {
  const { items } = useTodoContract()

  if (!items.length) {
    return <Text>You have no items available</Text>
  }

  return items.map(item => (
    <Item key={item.id} {...item} />
  ))
}

export default Items