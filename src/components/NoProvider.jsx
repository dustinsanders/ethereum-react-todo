import {
  Alert,
  Link,
  Text,
} from 'evergreen-ui'
import React from 'react'

const NoProvider = () => (
  <Alert
    intent="danger"
    title="No Ethereum Provider Detected"
  >
    <Text>Please install MetaMask</Text>
    &nbsp;
    <Link href="https://metamask.io" target="_blank">
      here
    </Link>
  </Alert>
)

export default NoProvider