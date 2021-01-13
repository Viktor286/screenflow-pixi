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

  merge(stateSlice: Partial<PublicViewportState>) {
    for (const property in stateSlice) {
      if (
        Object.prototype.hasOwnProperty.call(stateSlice, property) &&
        Object.prototype.hasOwnProperty.call(this, property)
      ) {
        this[property] = stateSlice[property];
      }
    }
  }
}
