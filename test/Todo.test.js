/* eslint-disable jest/valid-expect */

const { expect } = require('chai')
const { ethers } = require('hardhat')

const {
  parseBytes32String,
  formatBytes32String,
  parseUnits,
} = ethers.utils

const deployTodo = async () => {
  const Todo = await ethers.getContractFactory('Todo')

  return Todo.deploy()
}

const getSigner = async idx => {
  const signers = await ethers.getSigners()

  return signers[idx]
}

const getAddress = async idx => {
  const signer = await getSigner(idx)

  return signer.address
}

const addItem = async (todo, { title, price, assignee } = {}, signerIdx) =>
  todo
    .connect(await getSigner(signerIdx || 0))
    .addItem(
      formatBytes32String(title || 'Hello World!'),
      price || 1000,
      assignee || await getAddress(1),
    )

describe.only('Todo Contract', () => {
  it('should set the sender as the owner', async () => {
    const todo = await deployTodo()

    expect(await todo.owner()).to.equal(await getAddress(0))
  })

  it('should be able to add a item to the list', async () => {
    const todo = await deployTodo()
    const itemOptions = {
      title: 'Item #1',
      price: 100000,
      assignee: await getAddress(1),
    }
    await addItem(todo, itemOptions)
    const item = await todo.items(0)

    expect(parseBytes32String(item.title)).to.equal(itemOptions.title)
    expect(item.price).to.equal(itemOptions.price)
    expect(item.assignee).to.equal(itemOptions.assignee)
  })

  it('should allow owner to create items', async () => {
    const todo = await deployTodo()
    await expect(addItem(todo, {}, 1))
      .to.be.revertedWith('Ownable: caller is not the owner')
  })

  it('should allow owner to delete items', async () => {
    const todo = await deployTodo()
    await addItem(todo)
    await todo.deleteItem(0)

    expect(await todo.items(0)).to.have.property('status', 3)
  })

  it('should revert when trying to delete and status is not created', async () => {
    const todo = await deployTodo()
    const assignee = await getSigner(0)
    await addItem(todo, { assignee: assignee.address })
    await todo
      .connect(assignee)
      .completeItem(0)

    await expect(todo.deleteItem(0))
      .to.be.revertedWith('Incorrect status to delete item')
  })

  it('should revert if non-owner tries to delete item', async () => {
    const todo = await deployTodo()
    await addItem(todo)
    const notOwner = await getSigner(1)

    await expect(todo.connect(notOwner).deleteItem(0))
      .to.be.revertedWith('Ownable: caller is not the owner')
  })

  it('should allow assignee to complete items', async () => {
    const todo = await deployTodo()
    const assignee = await getSigner(0)
    await addItem(todo, { assignee: assignee.address })
    await todo
      .connect(assignee)
      .completeItem(0)

    expect(await todo.items(0)).to.have.property('status', 1)
  })

  it('should revert if non-assignee tries to complete item', async () => {
    const todo = await deployTodo()
    await addItem(todo)

    await expect(todo.completeItem(0))
      .to.be.revertedWith('Only the assignee can complete the task')
  })

  it('should revert when trying to complete and status is not created', async () => {
    const todo = await deployTodo()
    const assignee = await getSigner(0)
    await addItem(todo, { assignee: assignee.address })
    await todo.deleteItem(0)

    await expect(todo.connect(assignee).completeItem(0))
      .to.be.revertedWith('Incorrect status to complete item')
  })

  it('should allow owner to confirm and pay for item after assignee has completed it', async () => {
    const todo = await deployTodo()
    const price = parseUnits('1.0')
    const assignee = await getSigner(1)
    await addItem(todo, { price, assignee: assignee.address })
    await todo.connect(assignee).completeItem(0)

    const before = await assignee.getBalance()
    await todo.confirmItem(0, { value: price })
    const after = await assignee.getBalance()

    expect(await todo.items(0)).to.have.property('status', 2)
    expect(after.sub(before).eq(price)).to.equal(true)
  })

  it('should revert when trying to confirm and status is not completed', async () => {
    const todo = await deployTodo()
    const price = 1_000_000
    await addItem(todo, { price })
    await todo.deleteItem(0)

    await expect(todo.confirmItem(0, { value: price }))
      .to.be.revertedWith('Incorrect status to confirm item')
  })

  it('should revert item confirmation if exact amount is not sent', async () => {
    const todo = await deployTodo()
    const price = parseUnits('1.0')
    const assignee = await getSigner(1)
    await addItem(todo, { price, assignee: assignee.address })
    await todo.connect(assignee).completeItem(0)

    await expect(todo.confirmItem(0, { value: parseUnits('1.1') }))
      .to.be.revertedWith('Only full payments accepted')
  })
})