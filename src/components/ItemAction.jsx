import {
  Button,
  Pane,
  SendToIcon,
  TickIcon,
  TrashIcon,
} from 'evergreen-ui'
import useTodoContract from '../hooks/useTodoContract'
import statusEnum from '../enums/status'

const IconButton = ({ icon, ...props }) => (
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
  assignee,
  idx,
  price,
  status,
}) => {
  const {
    completeItem,
    confirmItem,
    deleteItem,
    isOwner,
    selectedAddress,
  } = useTodoContract()
  const isAssignee = selectedAddress.toLowerCase() === assignee.toLowerCase()

  switch (status) {
    case statusEnum.CREATED: {
      return (
        <>
          <IconButton
            disabled={!isOwner}
            icon={<TrashIcon />}
            marginRight={8}
            intent="danger"
            onClick={() => deleteItem(idx)}
            children="Delete"
          />
          <IconButton
            disabled={!isAssignee}
            icon={<TickIcon />}
            onClick={() => completeItem(idx)}
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
          onClick={() => confirmItem(idx, price)}
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