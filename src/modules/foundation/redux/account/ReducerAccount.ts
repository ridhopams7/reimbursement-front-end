import {
  Action,
  State,
} from '../../../../config/interfaces';

import {
  initialState,
  initialAction,
} from '../../../../config';

import {
  ACCOUNTFETCH,
  ACCOUNTSUCCESS,
  ACCOUNTFAILED,
} from '../../config';

export function ReducerAccount(state: State = initialState, action: Action = initialAction) {
  switch (action.type) {
    case ACCOUNTFETCH:
      return {
        ...state,
        fetch: true,
        data: action.data,
        action: action.type,
      };

    case ACCOUNTSUCCESS:
      return {
        ...state,
        fetch: false,
        res: action.data,
        action: action.type,
      };

    case ACCOUNTFAILED:
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