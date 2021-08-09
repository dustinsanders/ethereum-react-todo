import React, { useCallback, useState } from 'react'
import {
  Button,
  Dialog,
  EditIcon,
  Pane,
  TextInputField,
} from 'evergreen-ui'
import { utils } from 'ethers'
import useTodoContract from '../hooks/useTodoContract'
import toNumber from 'lodash/toNumber'

const minimumPrice = .01

const AddItem = () => {
  const { addItem, isOwner } = useTodoContract()

  const [assignee, setAssignee] = useState('')
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState(0)
  const [open, setOpen] = useState(false)
  const [isConfirmLoading, setIsConfirmLoading] = useState(false)

  const titleValid = title.length >= 3
  const assigneeValid = utils.isAddress(assignee)
  const priceValid = typeof toNumber(price) === 'number'
    && toNumber(price) >= minimumPrice
  const isConfirmDisabled = !(titleValid && assigneeValid && priceValid)

  const textInputFieldProps = {
    width: '100%',
    marginBottom: 16,
    required: true,
    disabled: isConfirmLoading,
  }

  const onConfirm = useCallback(async () => {
    setIsConfirmLoading(true)

    await addItem({ title, assignee, price })

    setIsConfirmLoading(false)
    setOpen(false)
  }, [title, assignee, price, setIsConfirmLoading, setOpen, addItem])

  return (
    <>
      <Button
        appearance="primary"
        iconBefore={EditIcon}
        width="100%"
        onClick={() => setOpen(true)}
        disabled={!isOwner}
      >
        Add New Item
      </Button>
      <Dialog
        title="Add Item"
        isShown={open}
        onCancel={() => setOpen(false)}
        onCloseComplete={() => setOpen(false)}
        onConfirm={onConfirm}
        isConfirmDisabled={isConfirmDisabled}
        isConfirmLoading={isConfirmLoading}
      >
        <Pane
          display="flex"
          width="100%"
          flexDirection="column"
        >
          <TextInputField
            {...textInputFieldProps}
            label="Title"
            value={title}
            isInvalid={!titleValid}
            onChange={evt => setTitle(evt.target.value)}
          />
          <TextInputField
            {...textInputFieldProps}
            label="Assignee Address"
            placeholder="0x..."
            value={assignee}
            isInvalid={!assigneeValid}
            onChange={evt => setAssignee(evt.target.value)}
          />
          <TextInputField
            {...textInputFieldProps}
            label="Price(ETH)"
            value={price}
            isInvalid={!priceValid}
            description={`Must be minimum of ${minimumPrice}(ETH)`}
            onChange={evt => setPrice(evt.target.value)}
          />
        </Pane>
      </Dialog>
    </>
  )
}

export default AddItem