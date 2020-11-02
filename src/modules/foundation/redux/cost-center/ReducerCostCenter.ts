import {
  Action,
  State,
} from '../../../../config/interfaces';

import {
  initialState,
  initialAction,
} from '../../../../config';

import {
  COSTCENTERBYORGFETCH,
  COSTCENTERBYORGSUCCESS,
  COSTCENTERBYORGFAILED,

  COSTCENTERALLFETCH,
  COSTCENTERALLSUCCESS,
  COSTCENTERALLFAILED,
} from '../../config';

export function ReducerCostCenterByOrg(state: State = initialState, action: Action = initialAction) {
  switch (action.type) {
    case COSTCENTERBYORGFETCH:
      return {
        ...state,
        fetch: true,
        data: action.data,
        action: action.type,
      };

    case COSTCENTERBYORGSUCCESS:
      return {
        ...state,
        fetch: false,
        res: action.data,
        action: action.type,
      };

    case COSTCENTERBYORGFAILED:
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

export function ReducerCostCenterAll(state: State = initialState, action: Action = initialAction) {
  switch (action.type) {
    case COSTCENTERALLFETCH:
      return {
        ...state,
        fetch: true,
        data: action.data,
        action: action.type,
      };

    case COSTCENTERALLSUCCESS:
      return {
        ...state,
        fetch: false,
        res: action.data,
        action: action.type,
      };

    case COSTCENTERALLFAILED:
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