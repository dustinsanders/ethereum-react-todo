import {
  ChangeEvent,
  useCallback,
  useState,
} from 'react'
import {
  Button,
  Dialog,
  EditIcon,
  Pane,
  TextInputField,
} from 'evergreen-ui'
import { utils } from 'ethers'
import toNumber from 'lodash/toNumber'
import { useStoreActions, useStoreState } from '../store/hooks'

const minimumPrice = .0001

const AddItem = () => {
  const { addItem } = useStoreActions(actions => actions.todo)
  const { isSameAddress, selectedAddress } = useStoreState(state => state.todo)

  const [assignee, setAssignee] = useState('')
  const [title, setTitle] = useState('')
  const [priceInEth, setPrice] = useState('')
  const [open, setOpen] = useState(false)
  const [isConfirmLoading, setIsConfirmLoading] = useState(false)

  const titleValid = title.length >= 3
  const assigneeValid = utils.isAddress(assignee)
    && !isSameAddress(assignee, selectedAddress)
  const priceValid = toNumber(priceInEth) >= minimumPrice
  const isConfirmDisabled = !(titleValid && assigneeValid && priceValid)

  const textInputFieldProps = {
    width: '100%',
    marginBottom: 16,
    required: true,
    disabled: isConfirmLoading,
  }

  const onConfirm = useCallback(async () => {
    setIsConfirmLoading(true)

    await addItem({ title, assignee, priceInEth })

    setIsConfirmLoading(false)
    setOpen(false)
  }, [title, assignee, priceInEth, setIsConfirmLoading, setOpen, addItem])

  return (
    <>
      <Button
        appearance="primary"
        iconBefore={EditIcon}
        onClick={() => setOpen(true)}
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
            placeholder="Title"
            value={title}
            isInvalid={!titleValid}
            onChange={(evt: ChangeEvent<HTMLInputElement>) => setTitle(evt.target.value)}
          />
          <TextInputField
            {...textInputFieldProps}
            label="Assignee Address"
            placeholder="0x..."
            value={assignee}
            isInvalid={!assigneeValid}
            onChange={(evt: ChangeEvent<HTMLInputElement>) => setAssignee(evt.target.value)}
          />
          <TextInputField
            {...textInputFieldProps}
            label="Price(ETH)"
            type="number"
            placeholder="0.0"
            value={priceInEth}
            isInvalid={!priceValid}
            description={`minimum of ${minimumPrice}(ETH)`}
            onChange={(evt: ChangeEvent<HTMLInputElement>) =>

              setPrice(evt.target.value)
            }
          />
        </Pane>
      </Dialog>
    </>
  )
}

export default AddItem