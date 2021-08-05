import React from 'react';
import {
  Badge,
  Button,
} from 'evergreen-ui'

const ItemStatus = ({ completed, confirmed, deleted }) => {
  if (deleted) {
    return <Badge color="red">Deleted</Badge>
  }

  if (confirmed) {
    return <Badge color="green">Confirmed & Paid</Badge>
  }

  if (completed) {
    return (
      <>
        <Badge color="yellow">Completed</Badge>
        <Button>Confirm & Pay</Button>
      </>
    )
  }

  return (
    <>
      <Badge color="blue">In Progress</Badge>
      <Button>Complete</Button>
    </>
  )
}

export default ItemStatus