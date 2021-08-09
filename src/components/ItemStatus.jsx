import React from 'react';
import { Badge } from 'evergreen-ui'
import statusEnum from '../enums/status'

const ItemStatus = ({
  assignee,
  status,
}) => {
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

export default ItemStatus