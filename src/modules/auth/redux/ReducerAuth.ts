import { Action, State } from '../../../config/interfaces';

import {
  initialAction,
  initialState,
} from '../../../config'

import {
  USERLOGINFETCH,
  USERLOGINSUCCESS,
  USERLOGINFAILED,
} from '../config';

export function ReducerAuth(state: State = initialState, action: Action = initialAction) {
  switch (action.type) {
    case USERLOGINFETCH:
      return {
        ...state,
        fetch: true,
        data: action.data,
        action: action.type,
      };

    case USERLOGINSUCCESS:
      return {
        ...state,
        fetch: false,
        res: action.data,
        action: action.type,
      };

    case USERLOGINFAILED:
      return {
        ...state,
        fetch: false,
        err: action.data,
        action: action.type,
      };

    default:
      return state;
  }
}
