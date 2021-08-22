import { useCallback, useState } from 'react'
import {
  Button,
  Pane,
  SendToIcon,
  TickIcon,
  TrashIcon,
} from 'evergreen-ui'
import statusEnum from '../enums/status'
import { useStoreActions } from '../store/hooks'
import { Item as ItemInterface } from '../store/models/todo'
import ethers from 'ethers'

const ItemAction = ({
  id,
  status,
  isAssignee,
  isOwner,
}: ItemInterface) => {
  const [loading, setLoading] = useState(false)
  const {
    completeItem,
    confirmItem,
    deleteItem,
  } = useStoreActions(actions => actions.todo)

  const wrapLoader = useCallback(
    (action: (id: ethers.BigNumber) => Promise<void>) =>
      async () => {
        try {
          setLoading(true)
          await action(id)
          setLoading(false)
        } catch (e) {
          console.error(e)
          setLoading(false)
        }
      },
    [id],
  )

  switch (status) {
    case statusEnum.CREATED: {
      return (
        <>
          <Button
            disabled={!isOwner}
            iconBefore={<TrashIcon />}
            marginRight={8}
            intent="danger"
            onClick={wrapLoader(deleteItem)}
            children="Delete"
            isLoading={loading && isOwner}
          />
          <Button
            disabled={!isAssignee}
            iconBefore={<TickIcon />}
            onClick={wrapLoader(completeItem)}
            intent="success"
            children="Complete"
            isLoading={loading && isAssignee}
          />
        </>
      )
    }
    case statusEnum.COMPLETED: {
      return (
        <Button
          disabled={!isOwner}
          iconBefore={<SendToIcon />}
          children="Confirm & Pay"
          intent="success"
          onClick={wrapLoader(confirmItem)}
          isLoading={loading}
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