import {
  Action,
  State,
} from '../../../../config/interfaces';

import {
  initialState,
  initialAction,
} from '../../../../config';

import {
  CURRENCYFETCH,
  CURRENCYSUCCESS,
  CURRENCYFAILED,
} from '../../config';

export function ReducerCurrency(state: State = initialState, action: Action = initialAction) {
  switch (action.type) {
    case CURRENCYFETCH:
      return {
        ...state,
        fetch: true,
        data: action.data,
        action: action.type,
      };

    case CURRENCYSUCCESS:
      return {
        ...state,
        fetch: false,
        res: action.data,
        action: action.type,
      };

    case CURRENCYFAILED:
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