import { IAppState, IStateSlice } from './index';

export default class StateManagerHelpers {
  static isScopeWithSubDomain(inputStr: string): boolean {
    return inputStr.indexOf('.') > -1;
  }

  static parseSubdomainScope(inputStr: string) {
    const result = {
      domain: '',
      target: '',
    };

    const parsedStr = inputStr.slice(1).split('/');

    if (parsedStr.length === 2) {
      result.domain = parsedStr[0];
      result.target = parsedStr[1];
      return result;
    }

    return result;
  }

  static isValidStateSlice(stateItem: IStateSlice) {
    return typeof stateItem === 'object' || Array.isArray(stateItem);
  }

  static isAnimationObject(property: string, value: any) {
    return property === 'animation' && typeof value === 'object';
  }

  static isGlobalStateValid(state: object, stateOrigin: IAppState) {
    if (typeof state === 'object' && !Array.isArray(state)) {
      for (const scope in stateOrigin) {
        if (Object.hasOwnProperty.call(stateOrigin, scope)) {
          return !state.hasOwnProperty(scope);
        }
      }
      return true;
    }
    return false;
  }
}
