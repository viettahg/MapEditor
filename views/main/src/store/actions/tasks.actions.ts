import { createActions } from 'redux-actions';
import { ITask } from '../reducers/tasks.reducers';

export enum GetTasks {
  Pending = '[Pending] GetTasks',
  Success = '[Success] GetTasks',
  Error = '[Error] GetTasks',
}

export enum ToggleTask {
  Success = '[Success] ToggleTask',
}

export enum AddTask {
  Success = '[Success] AddTask',
}

export enum DeleteTask {
  Success = '[Success] DeleteTask',
}

createActions({
  [GetTasks.Pending]: undefined,
  [GetTasks.Success]: (tasks: ITask[]) => ({ tasks }),
  [GetTasks.Error]: (error: string) => ({ error }),

  [ToggleTask.Success]: (id: number) => ({ id }),
  [AddTask.Success]: (value: string) => ({ value }),
  [DeleteTask.Success]: (id: number) => ({ id }),
});
