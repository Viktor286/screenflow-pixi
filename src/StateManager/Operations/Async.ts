import FlowApp from '../../Interfaces/FlowApp';
import { StateUpdateRequest } from '../StateUpdateRequest';

export type AsyncId = string;

export default class AsyncOperations {
  public asyncStore: Map<AsyncId, StateUpdateRequest> = new Map();

  constructor(public app: FlowApp) {}

  public add(asyncId: AsyncId, stateUpdate: StateUpdateRequest) {
    this.asyncStore.set(asyncId, stateUpdate);
  }

  public remove(asyncId: AsyncId) {
    this.asyncStore.delete(asyncId);
  }
}
