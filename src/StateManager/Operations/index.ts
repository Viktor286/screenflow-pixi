import FlowApp from '../../Interfaces/FlowApp';
import { StateScope, StateValue } from '../index';
import AsyncOperations, { AsyncId } from './Async';
import BoardOperations from './Board';
import ViewportOperations from './Viewport';
import { StateUpdateRequest } from '../StateUpdateRequest';

export default class Operations {
  public readonly async = new AsyncOperations(this.app);
  public scopeOperation: ViewportOperations | BoardOperations | undefined = undefined;
  // scope defining sections
  public readonly viewport = new ViewportOperations(this.app);
  public readonly board = new BoardOperations(this.app);

  constructor(public app: FlowApp) {}

  private getSection(key: StateScope) {
    // @ts-ignore
    return this[key];
  }

  private defineScopeOperation(stateUpdate: StateUpdateRequest): boolean {
    this.scopeOperation = undefined;

    if (Object.prototype.hasOwnProperty.call(this, stateUpdate.scope)) {
      const scopeOperation = this.getSection(stateUpdate.scope);
      if (scopeOperation) {
        this.scopeOperation = scopeOperation;
        return true;
      }
    }
    return false;
  }

  public execAnimation(stateUpdate: StateUpdateRequest): AsyncId | undefined {
    const asyncId: AsyncId = Math.random().toString(32).slice(2);

    if (this.defineScopeOperation(stateUpdate) && this.scopeOperation) {
      this.scopeOperation.animate(stateUpdate, asyncId);
      this.async.add(asyncId, stateUpdate);
      return asyncId;
    }

    return;
  }

  public execValue(
    property: string,
    updateValue: StateValue, // IAppState[keyof IAppState],
    stateUpdate: StateUpdateRequest,
  ): StateValue {
    // No operation idle
    if (stateUpdate.opSettings.noOp) {
      return updateValue;
    }

    if (this.defineScopeOperation(stateUpdate) && this.scopeOperation) {
      this.scopeOperation.update(property, updateValue, stateUpdate);
    }

    // Default return origin value
    return updateValue;
  }
}
