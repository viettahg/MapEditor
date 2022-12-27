import { Epic, ofType } from "redux-observable";
import { delay, mapTo } from "rxjs/operators";

// Actions
export enum ActionsType {
  PING = "PING",
  PONG = "PONG",
}

// State initialization
export type PingState = {
  isPinging: boolean;
};

export const initialState: PingState = {
  isPinging: false,
};

/**
 * Reducer for the PingPong actions
 */
export default function reducer(
  state: PingState = initialState,
  action: {
    type?: ActionsType;
  } = {}
) {
  switch (action.type) {
    case ActionsType.PING: {
      return {
        ...state,
        isPinging: true,
      };
    }
    case ActionsType.PONG: {
      return {
        ...state,
        isPinging: false,
      };
    }
    default:
      return state;
  }
}

// Action Creators
type ActionCreators = ReturnType<typeof startPing>;

export function startPing() {
  return { type: ActionsType.PING };
}

/**
 * Side Effect: Ping Epic Action
 */
export const pingEpic: Epic<ActionCreators, ActionCreators, PingState | void> = action$ => {
  return action$.pipe(
    ofType(ActionsType.PING),
    delay(1000), // Asynchronously wait 1000ms then continue
    mapTo({ type: ActionsType.PONG })
  );
};

// Selectors