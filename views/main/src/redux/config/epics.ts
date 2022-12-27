import { combineEpics } from 'redux-observable';
import { pingEpic } from '../ducks/ping';

/**
 * Merges all the epics into a single one
 */
export default combineEpics(
  pingEpic,
);