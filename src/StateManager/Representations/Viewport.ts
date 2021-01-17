import { StateUpdateRequest } from '../StateUpdateRequest';

export interface IViewportDepositState {
  scale: number;
  x: number;
  y: number;
}

export class PublicViewportState {
  [key: string]: any;

  scale: number;
  x: number;
  y: number;

  constructor() {
    this.scale = 1;
    this.x = 0;
    this.y = 0;
  }

  update(stateUpdate: StateUpdateRequest) {
    for (const property in stateUpdate.updated) {
      if (
        Object.prototype.hasOwnProperty.call(stateUpdate.updated, property) &&
        Object.prototype.hasOwnProperty.call(this, property)
      ) {
        this[property] = stateUpdate.updated[property];
      }
    }
  }
}
