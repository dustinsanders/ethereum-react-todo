import React from 'react'
import {
  Heading,
  Pane,
  Text,
} from 'evergreen-ui'
import AddItem from './AddItem'
import { useStoreState } from '../store/hooks'

export const height = 150

const Header = () => {
  const { selectedAddress } = useStoreState(state => state.todo)

  return (
    <Pane
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      paddingX={128}
      paddingTop={36}
      paddingBottom={16}
      marginTop={-10}
      background="gray100"
      borderRadius={3}
      elevation={4}
      height={height}
    >
      <Text>Todo Board for:</Text>
      <Heading size={600}>{selectedAddress}</Heading>
      <Pane marginY={8}>
        <AddItem />
      </Pane>
    </Pane>
  )
}

export default Header