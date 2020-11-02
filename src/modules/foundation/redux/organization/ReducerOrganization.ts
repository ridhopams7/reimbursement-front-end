import {
  Action,
  State,
} from '../../../../config/interfaces';

import {
  initialState,
  initialAction,
} from '../../../../config';

import {
  ORGANIZATIONALLFETCH,
  ORGANIZATIONALLSUCCESS,
  ORGANIZATIONALLFAILED,

  ORGANIZATIONBYIDFETCH,
  ORGANIZATIONBYIDSUCCESS,
  ORGANIZATIONBYIDFAILED,
} from '../../config';

export function ReducerOrganizationAll(state: State = initialState, action: Action = initialAction) {
  switch (action.type) {
    case ORGANIZATIONALLFETCH:
      return {
        ...state,
        fetch: true,
        data: action.data,
        action: action.type,
      };

    case ORGANIZATIONALLSUCCESS:
      return {
        ...state,
        fetch: false,
        res: action.data,
        action: action.type,
      };

    case ORGANIZATIONALLFAILED:
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

export function ReducerOrganizationById(state: State = initialState, action: Action = initialAction) {
  switch (action.type) {
    case ORGANIZATIONBYIDFETCH:
      return {
        ...state,
        fetch: true,
        data: action.data,
        action: action.type,
      };

    case ORGANIZATIONBYIDSUCCESS:
      return {
        ...state,
        fetch: false,
        res: action.data,
        action: action.type,
      };

    case ORGANIZATIONBYIDFAILED:
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