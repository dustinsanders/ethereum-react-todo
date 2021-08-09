import { Pane } from 'evergreen-ui'
import AddItem from './components/AddItem'
import Container from '@material-ui/core/Container'
import Header from './components/Header'
import Items from './components/Items'
import PageSpinner from './components/PageSpinner'
import useTodoContract from './hooks/useTodoContract'

const App = () => {
  const {
    items,
    loading,
    selectedAddress,
  } = useTodoContract()

  if (loading) {
    return <PageSpinner />
  }

  return (
    <>
    <Container maxWidth="sm">
      <Header />
      <br />
      <Pane
        alignItems="center"
        display="flex"
        flexDirection="column"
      >
        <AddItem />
        <hr />
        <Items items={items} selectedAddress={selectedAddress} />
      </Pane>
    </Container>
    </>
  );
}

export default App;