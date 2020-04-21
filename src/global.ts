import { InternalState } from './types';

const INTERNAL_STATE: InternalState = {
  current: null,
};

export function getInternalState() {
  return INTERNAL_STATE;
}
