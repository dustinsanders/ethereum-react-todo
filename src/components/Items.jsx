import React from 'react'
import {
  Card,
  Heading,
  Pane,
  Text,
} from 'evergreen-ui'
import ItemAction from './ItemAction'
import ItemStatus from './ItemStatus'
import statusEnum from '../enums/status'

const Items = ({ items }) => {
  return items.map((item, idx) => (
    <Card
      elevation={1}
      key={item.title}
      width="100%"
      height={120}
      margin={8}
      paddingX={24}
      display="flex"
      flexDirection="column"
    >
        <Pane
          display="flex"
          width="100%"
          alignItems="center"
        >
          <Pane
            display="flex"
            flexDirection="column"
            width="100%"
            marginY={8}
          >
            <Heading
              textDecoration={item.status === statusEnum.DELETED ? 'line-through' : 'auto'}
            >
              {item.title}
            </Heading>
            <div>
              <ItemStatus {...item} />
            </div>
          </Pane>
          <ItemAction {...item} idx={idx} />
        </Pane>
        <Text>Assignee: {item.assignee}</Text>
        <Text>Cost: {item.priceInEth}(ETH)</Text>
    </Card>
  ))
}

export default Items