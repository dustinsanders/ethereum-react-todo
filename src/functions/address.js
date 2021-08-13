const safeRequire = require('safe-require')
const local = safeRequire('./config/local')
const testnet = require('./config/testnet')
const get = require('lodash/get')
const { utils } = require('ethers')

const getValue = queryStringParameters => {
  const {
    CONTRACT_ADDRESS,
    NETLIFY_DEV,
  } = process.env

  if (get(queryStringParameters, 'net') === 'testnet') {
    return testnet
  }

  if (CONTRACT_ADDRESS && utils.isAddress(CONTRACT_ADDRESS)) {
    return CONTRACT_ADDRESS
  }

  return NETLIFY_DEV === 'true'
    ? local
    : testnet
}

console.log('process.env.NODE_ENV', process.env.NODE_ENV)

exports.handler = async ({ queryStringParameters }) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      value: getValue(queryStringParameters),
    })
  }
}