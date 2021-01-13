import { IOpSettings, StateScope, StateSlice } from './index';

export class StateUpdateRequest {
  targeting: string[];
  scope: StateScope;

  constructor(
    public locator: string = '', // 'viewport', '/board/${id}'
    public slice: StateSlice = {},
    public opSettings: Partial<IOpSettings> = {},
  ) {
    // todo LOCATOR-1: locator might have its own api and be instance of the class (upd StateUpdateRequest)
    const _locator = locator.startsWith('/') ? locator.slice(1) : locator;
    this.targeting = _locator.split('/');
    this.scope = this.targeting[0];
  }
}
