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

describe('Todo Contract', () => {
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
    expect(item.owner).to.equal((await getSigner(0)).address)
  })

  it('should allow owner to delete items', async () => {
    const todo = await deployTodo()
    await addItem(todo)
    await todo.deleteItem(0)

    expect(await todo.items(0)).to.have.property('status', 3)
  })

  it('should revert when trying to delete and status is not created', async () => {
    const todo = await deployTodo()
    const assignee = await getSigner(1)
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
    const assignee = await getSigner(1)
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
      .to.be.revertedWith('Assignable: caller is not the assignee')
  })

  it('should revert when trying to complete and status is not created', async () => {
    const todo = await deployTodo()
    const assignee = await getSigner(1)
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

  it('retrieve items associated to the caller', async () => {
    const todo = await deployTodo()

    const owner = await getSigner(0)
    const assignee = await getSigner(1)
    const otherAddress = await getSigner(2)

    const owned = { assignee: assignee.address, title: 'item 1' }
    const noAssociation = { assignee: otherAddress.address, title: 'item 2' }
    const assigned = { assignee: owner.address, title: 'item 3' }

    await addItem(todo, owned)
    await addItem(todo, noAssociation, 1)
    await addItem(todo, assigned, 1)

    const items = await todo.getItemsAtAddress(owner.address)

    expect(items).to.have.lengthOf(2)
    expect(parseBytes32String(items[0].title)).to.equal(owned.title)
    expect(items[0].owner).to.equal(owner.address)
    expect(parseBytes32String(items[1].title)).to.equal(assigned.title)
    expect(items[1].assignee).to.equal(owner.address)
  })

  it('should revert if the assignee is the same as owner', async () => {
    const todo = await deployTodo()
    const owner = await getSigner(0)

    await expect(addItem(todo, { assignee: owner.address }))
      .to.be.revertedWith('Item cannot be assigned to owner')
  })
})