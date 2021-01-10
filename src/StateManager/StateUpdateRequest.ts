import { IOpSettings, StateScope, StateSlice } from './index';

export class StateUpdateRequest {
  targeting: string[];
  scope: StateScope;

  constructor(
    public locator: string = '', // 'viewport', '/board/${id}'
    public slice: StateSlice = {},
    public opSettings: Partial<IOpSettings> = {},
  ) {
    const _locator = locator.startsWith('/') ? locator.slice(1) : locator;
    this.targeting = _locator.split('/');
    this.scope = this.targeting[0];
  }
}
