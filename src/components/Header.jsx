import React from 'react'
import {
  Heading,
  Pane,
  Text,
} from 'evergreen-ui'
import useTodoContract from '../hooks/useTodoContract'

const Header = () => {
  const { owner } = useTodoContract()

  return (
    <Pane
      display="flex"
      paddingX={16}
      paddingY={48}
      marginTop={-10}
      marginX={-32}
      background="gray100"
      borderRadius={3}
      alignItems="center"
      justifyContent="center"
      elevation={4}
    >
      <Text>Todo Board for:</Text>
      &nbsp;
      <Heading size={600}>{owner}</Heading>
    </Pane>
  )
}

export default Header