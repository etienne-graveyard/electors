import { DependencyList } from './types';

export function arrayShallowEqual(deps1: ReadonlyArray<any>, deps2: ReadonlyArray<any>): boolean {
  if (deps1 === deps2) {
    return true;
  }
  if (deps1.length !== deps2.length) {
    return false;
  }
  for (let i = 0; i < deps1.length; i++) {
    const dep = deps1[i];
    if (!Object.is(dep, deps2[i])) {
      return false;
    }
  }
  return true;
}

export function depsChanged(
  deps1: DependencyList | undefined,
  deps2: DependencyList | undefined
): boolean {
  if (deps1 === undefined || deps2 === undefined) {
    return true;
  }
  if (deps1.length !== deps2.length) {
    return true;
  }
  return !arrayShallowEqual(deps1, deps2);
}
