import * as PIXI from 'pixi.js';
import { CgObject } from './index';

export interface ICgContainerCompatible {
  cgObj: CgObject['cgObj'];
}

export class CgContainer extends CgObject implements ICgContainerCompatible {
  store = new Array<ICgContainerCompatible>();
  indexHashes = new Map<string, number>();

  constructor(public cgContainer = new PIXI.Container()) {
    super(cgContainer);
  }

  prependElement(element: ICgContainerCompatible): string {
    // Engine bindings
    this.cgContainer.addChild(element.cgObj);
    this.cgContainer.setChildIndex(element.cgObj, 0);

    // CgContainer hashed array store
    const hash = Math.random().toString(32).slice(2);

    const newIndex = new Map<string, number>();
    newIndex.set(hash, 0);
    this.indexHashes.forEach((index, hash) => {
      newIndex.set(hash, index + 1);
    });

    this.indexHashes = newIndex;
    this.store = [element, ...this.store];
    return hash;
  }

  getElement(hash: string): ICgContainerCompatible | undefined {
    const index = this.indexHashes.get(hash);
    if (index) {
      return this.store[index];
    }
  }

  getElementsIndex(hash: string): number | undefined {
    return this.indexHashes.get(hash);
  }

  deleteElement(hash: string): boolean {
    const element = this.getElement(hash);
    const elementIdx = this.getElementsIndex(hash);
    if (element && elementIdx) {
      this.cgContainer.removeChild(element.cgObj);
      this.store = [...this.store.slice(0, elementIdx), ...this.store.slice(elementIdx + 1)];
      this.indexHashes.delete(hash);

      // Re-arrange engine indexes
      this.indexHashes.forEach((index, hash) => {
        const el = this.getElement(hash);
        if (el) {
          this.cgContainer.setChildIndex(el.cgObj, index);
        }
      });
      return true;
    }
    return false;
  }

  getAllElements(): ICgContainerCompatible[] {
    return this.store;
  }
}
