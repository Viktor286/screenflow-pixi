import { createStore, Store as ReduxStore } from "redux";
import { combineReducers } from "redux";
import todos from "./Reducers/todos";
import visibilityFilter from "./Reducers/visibilityFilter";

export type Store = ReduxStore;

interface IState<T> {
  past: Array<T>;
  present: T;
  future: Array<T>;
}

interface IFlowAppState {
  viewportX: number;
}

export function initStore(): Store {
  const store: Store = createStore(
    combineReducers({
      todos,
      visibilityFilter,
    })
  );

  store.subscribe(() => console.log("subscribed store", store.getState()));

  return store;
}

function execInstructions(state: IState<IFlowAppState>) {
  // state.present.viewportX
  // present
  // { viewportX: 10 }
  // past
  // { viewportX: 999 }
  // compare all
}
