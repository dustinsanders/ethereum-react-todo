import React from 'react'
import {
  Card,
  Heading,
  Pane,
  Text,
} from 'evergreen-ui'
import ItemStatus from './ItemStatus'

const Items = ({ items }) => {
  return items.map(item => (
    <Card
      elevation={2}
      key={item.title}
      width="100%"
      height={120}
      margin={8}
      display="flex"
      justifyContent="space-around"
      alignItems="center"
      flexDirection="column"
    >
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          paddingX={24}
        >
          <Heading marginRight={8}>{item.title}</Heading>
          <ItemStatus {...item} />
        </Pane>
        <Text>Assignee: {item.assignee}</Text>
        <Text>Cost: {item.priceInEth}(ETH)</Text>
    </Card>
  ))
}

export default Items