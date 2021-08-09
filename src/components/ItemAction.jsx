import {
  Button,
  SymbolDiamondIcon,
  TickIcon,
  TrashIcon,
} from 'evergreen-ui'
import useTodoContract from '../hooks/useTodoContract'
import statusEnum from '../enums/status'

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
          <Button
            disabled={!isOwner}
            iconBefore={TrashIcon}
            marginRight={8}
            intent="danger"
            onClick={() => deleteItem(idx)}
            children="Delete"
          />
          <Button
            disabled={!isAssignee}
            iconBefore={TickIcon}
            onClick={() => completeItem(idx)}
            children="Complete"
          />
        </>
      )
    }
    case statusEnum.COMPLETED: {
      return (
        <Button
          disabled={!isOwner}
          iconBefore={SymbolDiamondIcon}
          children="Confirm & Pay"
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