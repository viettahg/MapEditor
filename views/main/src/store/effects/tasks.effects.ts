import { catchError, map, switchMap } from 'rxjs/operators';
import { ActionsObservable, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { Action } from 'redux-actions';

import { getTasks } from '../services/tasks.services';
import { GetTasks } from '../actions/tasks.actions';

export const getTasks$ = (actions$: ActionsObservable<Action>) => {
  return actions$.pipe(
    ofType(GetTasks.Pending),
    switchMap(() => {
      return getTasks().pipe(
        map(data => ({
          type: GetTasks.Success,
          payload: { tasks: data },
        })),
        catchError(error => {
          const message = JSON.parse(JSON.stringify(error)).message || 'unknown error';
          return of({
            type: GetTasks.Error,
            payload: { error: message },
          });
        }),
      );
    }),
  );
};
