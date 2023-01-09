import { applyMiddleware, combineReducers, createStore } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import tasks, { ITasksState } from './reducers/tasks.reducers';
import { getTasks$ } from './effects/tasks.effects';

export interface IStore {
  tasks: ITasksState,
}

const observableMiddleware = createEpicMiddleware();

const reducers = combineReducers({
  tasks,
});

export const store = createStore(
  reducers,
  applyMiddleware(observableMiddleware),
);

observableMiddleware.run(
  combineEpics<any>(
    getTasks$,
  ),
);
