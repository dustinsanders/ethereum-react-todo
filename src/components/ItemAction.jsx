import {
  Button,
  SymbolDiamondIcon,
  TickIcon,
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
    isOwner,
    selectedAddress,
  } = useTodoContract()
  const isAssignee = selectedAddress.toLowerCase() === assignee.toLowerCase()

  switch (status) {
    case statusEnum.CREATED: {
      return (
        <Button
          disabled={!isAssignee}
          iconBefore={TickIcon}
          children="Complete"
          onClick={() => completeItem(idx)}
        />
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