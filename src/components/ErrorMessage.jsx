import {
  Alert,
  Link,
  Text,
} from 'evergreen-ui'
import React from 'react'

const network = 'Ropsten'

const ErrorMessage = () => (
  <Alert
    intent="danger"
    title="Unable to connect to smart contract"
  >
    <Text>
      Please ensure MetaMask is&nbsp;
      <Link href="https://metamask.io" target="_blank">
        installed
      </Link>
      &nbsp;and connected to the {network} network
    </Text>
  </Alert>
)

export default ErrorMessage