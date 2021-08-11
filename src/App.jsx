import { Pane } from 'evergreen-ui'
import Container from '@material-ui/core/Container'
import Header, { height } from './components/Header'
import Items from './components/Items'
import NoProvider from './components/NoProvider'
import PageSpinner from './components/PageSpinner'
import useTodoContract from './hooks/useTodoContract'

const App = () => {
  const {
    items,
    loading,
    noProvider,
    selectedAddress,
  } = useTodoContract()

  if (noProvider) {
    return (
      <Container maxWidth="sm">
        <NoProvider />
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
    <Container maxWidth="sm">
      <Pane
        alignItems="center"
        display="flex"
        flexDirection="column"
        marginTop={height + 16}
      >
        <Items items={items} selectedAddress={selectedAddress} />
      </Pane>
    </Container>
    </>
  )
}

export default App;