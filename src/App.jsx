import {
  Pane,
  Spinner,
} from 'evergreen-ui'
import AddItem from './components/AddItem'
import Items from './components/Items'
import Container from '@material-ui/core/Container'
import useTodoContract from './hooks/useTodoContract'

const App = () => {
  const { items, loading } = useTodoContract()

  return (
    <Container maxWidth="sm">
      <Pane
        alignItems="center"
        display="flex"
        flexDirection="column"
      >
        {
          !loading ? <>
            <AddItem />
            <hr />
            <Items items={items} />
          </> : <Spinner />
        }
      </Pane>
    </Container>
  );
}

export default App;