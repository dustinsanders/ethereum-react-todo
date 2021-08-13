const safeRequire = require('safe-require')
const local = safeRequire('./config/local')
const testnet = require('./config/testnet')
const get = require('lodash/get')
const { utils } = require('ethers')

const getValue = queryStringParameters => {
  const {
    CONTRACT_ADDRESS,
    NODE_ENV,
  } = process.env

  if (get(queryStringParameters, 'net') === 'testnet') {
    return testnet
  }

  if (CONTRACT_ADDRESS && utils.isAddress(CONTRACT_ADDRESS)) {
    return CONTRACT_ADDRESS
  }

  return NODE_ENV === 'production'
    ? testnet
    : local
}

exports.handler = async ({ queryStringParameters }) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      value: getValue(queryStringParameters)
    })
  }
}