import {
  Action,
  State,
} from '../../../../config/interfaces';

import {
  initialState,
  initialAction,
} from '../../../../config';

import {
  PROJECTBYORGFETCH,
  PROJECTBYORGSUCCESS,
  PROJECTBYORGFAILED,

  PROJECTALLFETCH,
  PROJECTALLSUCCESS,
  PROJECTALLFAILED,
} from '../../config';

export function ReducerProjectByOrg(state: State = initialState, action: Action = initialAction) {
  switch (action.type) {
    case PROJECTBYORGFETCH:
      return {
        ...state,
        fetch: true,
        data: action.data,
        action: action.type,
      };

    case PROJECTBYORGSUCCESS:
      return {
        ...state,
        fetch: false,
        res: action.data,
        action: action.type,
      };

    case PROJECTBYORGFAILED:
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

export function ReducerProjectAll(state: State = initialState, action: Action = initialAction) {
  switch (action.type) {
    case PROJECTALLFETCH:
      return {
        ...state,
        fetch: true,
        data: action.data,
        action: action.type,
      };

    case PROJECTALLSUCCESS:
      return {
        ...state,
        fetch: false,
        res: action.data,
        action: action.type,
      };

    case PROJECTALLFAILED:
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