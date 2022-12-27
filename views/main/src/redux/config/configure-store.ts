import { createStore, applyMiddleware, compose } from "redux";
import { createEpicMiddleware } from "redux-observable";
import rootReducer from "./reducers";
import rootEpic from "./epics";

// ts delclare global
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const epicMiddleware = createEpicMiddleware();

// Enhancers are used in this case for the redux extension
export default function configureStore() {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    rootReducer,
    composeEnhancers(
      applyMiddleware(
        epicMiddleware,
      )
    )
  );
  
  epicMiddleware.run(rootEpic);
  return store;
};