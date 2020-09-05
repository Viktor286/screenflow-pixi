// import { Action as ReduxAction, Store as ReduxStore } from "redux";
import { Store as ReduxStore } from 'redux';

export interface IReduxAction {
  type: string;
}

// type AnyFunction = (...args: any[]) => any;
// type StringMap<T> = { [key: string]: T };
//
// export type Action<T extends string = string, P = void> = P extends void
//   ? ReduxAction<T>
//   : ReduxAction<T> & Readonly<{ payload: P }>;
//
// export type ActionsUnion<A extends StringMap<AnyFunction>> = ReturnType<
//   A[keyof A]
//   >;
//
// export type State = {};

export type Store = ReduxStore;

// export type Actions = undefined;

// export type DispatchAction<T = void> = ThunkAction<
