import Main from './components/Main'
import { StoreProvider } from 'easy-peasy'
import store from './store'

const App = () => (
  <StoreProvider store={store}>
    <Main />
  </StoreProvider>
)

export default App