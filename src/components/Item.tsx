import {
  Card,
  Heading,
  Pane,
  Text,
} from 'evergreen-ui'
import ItemAction from './ItemAction'
import ItemStatus from './ItemStatus'
import statusEnum from '../enums/status'
import { Item as ItemInterface } from '../store/models/todo'

interface SpacedTextProps {
  left: string
  right: string
}
const SpacedText = ({ left, right }: SpacedTextProps) => (
  <Pane
    display="flex"
    justifyContent="space-between"
  >
    <Text>{left}</Text>
    <Text>{right}</Text>
  </Pane>
)

const Item = (props: ItemInterface) => (
  <Card
    elevation={1}
    marginY={8}
    padding={24}
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
          <Heading textDecoration={
            props.status === statusEnum.DELETED ? 'line-through' : 'auto'
          }>
            {props.title}
          </Heading>
          <div>
            <ItemStatus {...props} />
          </div>
        </Pane>
        <Pane display="flex">
          <ItemAction {...props} />
        </Pane>
      </Pane>
      <br />
      <SpacedText
        left="Cost:"
        right={`${props.priceInEth} (ETH)`}
      />
      <SpacedText
        left="Owner:"
        right={props.owner}
      />
      <SpacedText
        left="Assignee:"
        right={props.assignee}
      />
  </Card>
)


export default Item