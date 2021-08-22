import { createStore } from 'easy-peasy'
import todoModel, { TodoModel } from './models/todo'

export interface StoreModel {
  todo: TodoModel
}

const storeModel: StoreModel = {
  todo: todoModel,
}

const store = createStore<StoreModel>(storeModel)

export default store