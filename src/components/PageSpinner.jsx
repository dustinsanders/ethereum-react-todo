import React from 'react'
import {
  Pane,
  Spinner,
} from 'evergreen-ui'

const PageSpinner = () => (
  <Pane
    alignItems="center"
    display="flex"
    flexDirection="column"
    marginTop={64}
  >
    <Spinner />
  </Pane>
)

export default PageSpinner