exports.handler = async () => ({
  statusCode: 200,
  body: JSON.stringify({ value: process.env.CONTRACT_ADDRESS })
})