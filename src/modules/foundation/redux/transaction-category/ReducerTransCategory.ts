import {
  Action,
  State,
} from '../../../../config/interfaces';

import {
  initialState,
  initialAction,
} from '../../../../config';

import {
  TRANSCATBYORGFETCH,
  TRANSCATBYORGSUCCESS,
  TRANSCATBYORGFAILED,
} from '../../config';

export function ReducerTransCatByOrg(state: State = initialState, action: Action = initialAction) {
  switch (action.type) {
    case TRANSCATBYORGFETCH:
      return {
        ...state,
        fetch: true,
        data: action.data,
        action: action.type,
      };

    case TRANSCATBYORGSUCCESS:
      return {
        ...state,
        fetch: false,
        res: action.data,
        action: action.type,
      };

    case TRANSCATBYORGFAILED:
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