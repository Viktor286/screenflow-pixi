import { gsap } from 'gsap';
// import { IGsapProps } from '../../types/global'; // for aditional props
import { CgObject } from './index';

interface IAnimationCallbacks {
  onStart(): void;
  onUpdate(): void;
  onComplete(): void;
}

const fn = function () {};

export function animateCgObject(
  cgObject: CgObject,
  CgObjectProps: Partial<CgObject>,
  { onStart = fn, onUpdate = fn, onComplete = fn }: Partial<IAnimationCallbacks>,
): Promise<Partial<CgObject>> {
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
