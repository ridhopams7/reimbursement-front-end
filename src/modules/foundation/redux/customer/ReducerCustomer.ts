import {
  Action,
  State,
} from '../../../../config/interfaces';

import {
  initialState,
  initialAction,
} from '../../../../config';

import {
  CUSTOMERBYORGFETCH,
  CUSTOMERBYORGSUCCESS,
  CUSTOMERBYORGFAILED,

  CUSTOMERALLFETCH,
  CUSTOMERALLSUCCESS,
  CUSTOMERALLFAILED,
} from '../../config';

export function ReducerCustomerByOrg(state: State = initialState, action: Action = initialAction) {
  switch (action.type) {
    case CUSTOMERBYORGFETCH:
      return {
        ...state,
        fetch: true,
        data: action.data,
        action: action.type,
      };

    case CUSTOMERBYORGSUCCESS:
      return {
        ...state,
        fetch: false,
        res: action.data,
        action: action.type,
      };

    case CUSTOMERBYORGFAILED:
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

export function ReducerCustomerAll(state: State = initialState, action: Action = initialAction) {
  switch (action.type) {
    case CUSTOMERALLFETCH:
      return {
        ...state,
        fetch: true,
        data: action.data,
        action: action.type,
      };

    case CUSTOMERALLSUCCESS:
      return {
        ...state,
        fetch: false,
        res: action.data,
        action: action.type,
      };

    case CUSTOMERALLFAILED:
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