import detectEthereumProvider from '@metamask/detect-provider'
import get from 'lodash/get'
import { ethers } from 'ethers'
import { abi } from '../../../artifacts/contracts/Todo.sol/Todo.json'
import { Todo } from '../../../artifacts/typechain'

export const getContractAddress = async (): Promise<string> =>  {
  const net = window.location.pathname.split('/')[1]
  const queryParam = net !== '' ? `?net=${net}` : ''
  const response = await fetch(`/.netlify/functions/address${queryParam}`)
  const { value } = await response.json()

  console.info(`Using contract address: ${value}`)

  return value
}

export const getInstance = async (
  contractAddress: string,
  withSigner = false,
): Promise<Todo> => {
  // TODO is there a better alternative to !
  const provider = new ethers.providers.Web3Provider(window.ethereum!)

  return new ethers.Contract(
    contractAddress,
    abi,
    withSigner ?  provider.getSigner() : provider,
  ) as Todo
}

export const getSelectedAddress = async (): Promise<string> => {
  const provider = await detectEthereumProvider()

  if (!provider) {
    throw new Error('MetaMask not installed')
  }

  const ethereum: any = window.ethereum

  await ethereum.request({ method: 'eth_requestAccounts' })

  ethereum.on('accountsChanged', () => {
    window.location.reload()
  })

  return get(provider, 'selectedAddress', '')
}