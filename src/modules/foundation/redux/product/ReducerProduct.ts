import {
  Action,
  State,
} from '../../../../config/interfaces';

import {
  initialState,
  initialAction,
} from '../../../../config';

import {
  PRODUCTBYORGFETCH,
  PRODUCTBYORGSUCCESS,
  PRODUCTBYORGFAILED,

  PRODUCTALLFETCH,
  PRODUCTALLSUCCESS,
  PRODUCTALLFAILED,
} from '../../config';

export function ReducerProductByOrg(state: State = initialState, action: Action = initialAction) {
  switch (action.type) {
    case PRODUCTBYORGFETCH:
      return {
        ...state,
        fetch: true,
        data: action.data,
        action: action.type,
      };

    case PRODUCTBYORGSUCCESS:
      return {
        ...state,
        fetch: false,
        res: action.data,
        action: action.type,
      };

    case PRODUCTBYORGFAILED:
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

export function ReducerProductAll(state: State = initialState, action: Action = initialAction) {
  switch (action.type) {
    case PRODUCTALLFETCH:
      return {
        ...state,
        fetch: true,
        data: action.data,
        action: action.type,
      };

    case PRODUCTALLSUCCESS:
      return {
        ...state,
        fetch: false,
        res: action.data,
        action: action.type,
      };

    case PRODUCTALLFAILED:
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