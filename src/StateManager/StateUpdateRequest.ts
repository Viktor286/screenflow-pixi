import { StateProperty, StateScope, StateValue } from './index';
import { IOpSettings, StateSlice } from './index';

export class StateUpdateRequest {
  public readonly location: StateLocation;
  public updated: StateSlice = {};
  public updatedCnt: number = 0;

  constructor(
    public locator: string = '',
    public slice: StateSlice = {},
    public opSettings: Partial<IOpSettings> = {},
  ) {
    this.location = new StateLocation(locator);
  }

  addToUpdated(property: StateProperty, value: StateValue) {
    this.updated[property] = value;
    this.updatedCnt += 1;
  }
}

export class StateLocation {
  pathArray: string[];
  scope: StateScope;
  levels: number;
  target: string;

  constructor(
    public locator: string = '', // 'viewport', '/board/${id}'
  ) {
    const _locator = locator.startsWith('/') ? locator.slice(1) : locator;
    this.pathArray = _locator.split('/');
    this.scope = this.pathArray[0];
    this.levels = this.pathArray.length;
    this.target = this.pathArray[this.pathArray.length - 1];
  }
}
