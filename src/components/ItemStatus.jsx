import React from 'react';
import { Badge } from 'evergreen-ui'
import statusEnum from '../enums/status'

const ItemStatusBadge = ({ status }) => {
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

const ItemStatus = ({
  isOwner,
  status,
}) => {

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