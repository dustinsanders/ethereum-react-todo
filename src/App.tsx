import React, { useEffect } from 'react'
import { Pane } from 'evergreen-ui'
import Container from '@material-ui/core/Container'
import Header, { height } from './components/Header'
import ErrorMessage from './components/ErrorMessage'
import Items from './components/Items'
import PageSpinner from './components/PageSpinner'
import { StoreProvider } from 'easy-peasy'
import store from './store'
import { useStoreState, useStoreActions } from './store/hooks'

const App = () => {
  const {
    error,
    items,
    loading,
    selectedAddress,
  } = useStoreState(state => state.todo)

  const actions = useStoreActions(state => state.todo)

  useEffect(() => {
    actions.initialize()
  }, [actions])

  if (error) {
    return (
      <Container maxWidth="sm">
        <ErrorMessage />
      </Container>
    )
  }

  if (loading) {
    return <PageSpinner />
  }

  return (
    <>
      <Pane
        position="fixed"
        width="100%"
        marginBottom={150}
        top={0}
        left={0}
        zIndex={10}
      >
        <Pane
          display="flex"
          justifyContent="center"
        >
          <Header />
        </Pane>
      </Pane>
      <Pane
        display="flex"
        alignItems="center"
        flexDirection="column"
        marginTop={height + 16}
      >
        <Container maxWidth="sm">
          <Items />
        </Container>
      </Pane>
    </>
  )
}

export default () => <StoreProvider store={store}><App /></StoreProvider>