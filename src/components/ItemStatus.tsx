import React from 'react';
import { Badge } from 'evergreen-ui'
import statusEnum from '../enums/status'

interface ItemStatusBadgeProps {
  status: number
}
const ItemStatusBadge = ({ status }: ItemStatusBadgeProps) => {
  switch (status) {
    case statusEnum.CREATED: {
      return <Badge color="blue">In Progress</Badge>
    }
    case statusEnum.COMPLETED: {
      return <Badge color="yellow">Completed</Badge>
    }
    case statusEnum.CONFIRMED: {
      return <Badge color="green">Confirmed & Paid</Badge>
    }
    case statusEnum.DELETED: {
      return <Badge color="red">Deleted</Badge>
    }
    default: {
      return <></>
    }
  }
}

interface ItemStatusProps {
  isOwner: boolean
  status: number
}
const ItemStatus = ({
  isOwner,
  status,
}: ItemStatusProps) => {

  return (
    <>
      {
        isOwner
          ? <Badge color="teal">Owner</Badge>
          : <Badge color="purple">Assignee</Badge>
      }
      &nbsp;
      <ItemStatusBadge status={status} />
    </>
  )
}

export default ItemStatus