import { gsap } from 'gsap';
// import { IGsapProps } from '../../types/global'; // for aditional props
import { CgBaseObject } from '../index';

interface IAnimationCallbacks {
  onStart(): void;
  onUpdate(): void;
  onComplete(): void;
}

const fn = function () {};

export function animateCgObject(
  cgObject: CgBaseObject,
  CgObjectProps: Partial<CgBaseObject>,
  { onStart = fn, onUpdate = fn, onComplete = fn }: Partial<IAnimationCallbacks>,
): Promise<Partial<CgBaseObject>> {
  cgObject.isScaleFromCenter = true;
  return new Promise((resolve) => {
    gsap.to(cgObject, {
      ...CgObjectProps,
      duration: 0.5,
      ease: 'power3.out',
      onStart: () => {
        onStart();
      },
      onUpdate: () => {
        onUpdate();
      },
      onComplete: () => {
        onComplete();
        resolve({ ...CgObjectProps });
      },
    });
  });
}
