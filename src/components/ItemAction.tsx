import {
  Button,
  Pane,
  SendToIcon,
  TickIcon,
  TrashIcon,
  ButtonProps,
} from 'evergreen-ui'
import statusEnum from '../enums/status'
import { useStoreActions } from '../store/hooks'
import { Item as ItemInterface } from '../store/models/todo'

interface IconButtonProps extends ButtonProps {
  icon: JSX.Element,
}
const IconButton = ({ icon, ...props }: IconButtonProps) => (
  <Button
    iconBefore={
      <Pane
        display="flex"
        marginRight={-4}
        paddingLeft={4}
      >
        {icon}
      </Pane>
    }
    {...props}
  />
)

const ItemAction = ({
  id,
  price,
  status,
  isAssignee,
  isOwner,
}: ItemInterface) => {
  const {
    completeItem,
    confirmItem,
    deleteItem,
  } = useStoreActions(actions => actions.todo)

  switch (status) {
    case statusEnum.CREATED: {
      return (
        <>
          <IconButton
            disabled={!isOwner}
            icon={<TrashIcon />}
            marginRight={8}
            intent="danger"
            onClick={() => deleteItem(id)}
            children="Delete"
          />
          <IconButton
            disabled={!isAssignee}
            icon={<TickIcon />}
            onClick={() => completeItem(id)}
            intent="success"
            children="Complete"
          />
        </>
      )
    }
    case statusEnum.COMPLETED: {
      return (
        <IconButton
          disabled={!isOwner}
          icon={<SendToIcon />}
          children="Confirm & Pay"
          intent="success"
          onClick={() => confirmItem(id)}
        />
      )
    }
    case statusEnum.CONFIRMED: {
      return <></>
    }
    case statusEnum.DELETED: {
      return <></>
    }
    default: {
      return <></>
    }
  }
}

export default ItemAction