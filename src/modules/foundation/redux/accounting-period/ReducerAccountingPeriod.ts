import {
  Action,
  State,
} from '../../../../config/interfaces';

import {
  initialState,
  initialAction,
} from '../../../../config';

import {
  ACCPERIODALLFETCH,
  ACCPERIODALLSUCCESS,
  ACCPERIODALLFAILED,

  ACCPERIODBYSTATEFETCH,
  ACCPERIODBYSTATESUCCESS,
  ACCPERIODBYSTATEFAILED,

  ACCPERIODDATEBYSTATEFETCH,
  ACCPERIODDATEBYSTATESUCCESS,
  ACCPERIODDATEBYSTATEFAILED,
} from '../../config';

export function ReducerAccountingPeriodAll(state: State = initialState, action: Action = initialAction) {
  switch (action.type) {
    case ACCPERIODALLFETCH:
      return {
        ...state,
        fetch: true,
        data: action.data,
        action: action.type,
      };

    case ACCPERIODALLSUCCESS:
      return {
        ...state,
        fetch: false,
        res: action.data,
        action: action.type,
      };

    case ACCPERIODALLFAILED:
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

export function ReducerAccountingPeriodByState(state: State = initialState, action: Action = initialAction) {
  switch (action.type) {
    case ACCPERIODBYSTATEFETCH:
      return {
        ...state,
        fetch: true,
        data: action.data,
        action: action.type,
      };

    case ACCPERIODBYSTATESUCCESS:
      return {
        ...state,
        fetch: false,
        res: action.data,
        action: action.type,
      };

    case ACCPERIODBYSTATEFAILED:
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

export function ReducerAccountingPeriodDateByState(state: State = initialState, action: Action = initialAction) {
  switch (action.type) {
    case ACCPERIODDATEBYSTATEFETCH:
      return {
        ...state,
        fetch: true,
        data: action.data,
        action: action.type,
      };

    case ACCPERIODDATEBYSTATESUCCESS:
      return {
        ...state,
        fetch: false,
        res: action.data,
        action: action.type,
      };

    case ACCPERIODDATEBYSTATEFAILED:
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