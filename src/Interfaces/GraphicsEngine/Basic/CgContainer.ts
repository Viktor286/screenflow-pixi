import * as PIXI from 'pixi.js';
import { CgBaseObject } from '../index';

export class CgContainer extends CgBaseObject {
  children = new Array<CgContainer>();
  indexHashes = new Map<string, number>();

  constructor(public cgObj: PIXI.Container = new PIXI.Container()) {
    super(cgObj);
    this.cgObj.sortableChildren = true;
    // this.cgObj.interactive = false; // deactivate by default
  }

  prependElement(element: CgContainer): string {
    // Engine bindings
    this.cgObj.addChild(element.cgObj);
    this.cgObj.setChildIndex(element.cgObj, 0);

    // TODO: make abstraction for this addition and other operations
    // CgContainer hashed array store
    const hash = Math.random().toString(32).slice(2);

    const newIndex = new Map<string, number>();
    newIndex.set(hash, 0);
    this.indexHashes.forEach((index, hash) => {
      newIndex.set(hash, index + 1);
    });

    this.indexHashes = newIndex;
    this.children = [element, ...this.children];
    return hash;
  }

  getElement(hash: string): CgContainer | undefined {
    const index = this.indexHashes.get(hash);
    if (index) {
      return this.children[index];
    }
  }

  getElementsIndex(hash: string): number | undefined {
    return this.indexHashes.get(hash);
  }

  deleteElement(hash: string): boolean {
    const element = this.getElement(hash);
    const elementIdx = this.getElementsIndex(hash);
    if (element && elementIdx) {
      this.cgObj.removeChild(element.cgObj);
      this.children = [...this.children.slice(0, elementIdx), ...this.children.slice(elementIdx + 1)];
      this.indexHashes.delete(hash);

      // Re-arrange engine indexes
      this.indexHashes.forEach((index, hash) => {
        const el = this.getElement(hash);
        if (el) {
          this.cgObj.setChildIndex(el.cgObj, index);
        }
      });
      return true;
    }
    return false;
  }

  getAllElements(): CgContainer[] {
    return this.children;
  }
}
