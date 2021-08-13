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

const Item = props => (
  <Card
    elevation={1}
    key={props.id}
    width="100%"
    height={120}
    marginY={8}
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
            textDecoration={props.status === statusEnum.DELETED ? 'line-through' : 'auto'}
          >
            {props.title}
          </Heading>
          <div>
            <ItemStatus {...props} />
          </div>
        </Pane>
        <ItemAction {...props} />
      </Pane>
      <Text>Assignee: {props.assignee}</Text>
      <Text>Cost: {props.priceInEth}(ETH)</Text>
  </Card>
)


export default Item