import { IUniScreenCoords } from '../Interfaces/Viewport';

export default class DataConvertors {
  static convertToXYPoint(uniPoint: IUniScreenCoords) {
    let x = 0;
    let y = 0;

    if (uniPoint.sX !== undefined && uniPoint.sY !== undefined) {
      x = uniPoint.sX;
      y = uniPoint.sY;
    }

    if (uniPoint.wX !== undefined && uniPoint.wY !== undefined) {
      x = uniPoint.wX;
      y = uniPoint.wY;
    }

    if (uniPoint.x !== undefined && uniPoint.y !== undefined) {
      x = uniPoint.x;
      y = uniPoint.y;
    }

    return { x, y };
  }
}
