export interface IPoint {
  x: number;
  y: number;
}

export interface ITransforms extends IPoint {
  s: number;
}

export interface IGsapProps {
  duration?: number;
  ease?: string;
}
