import { Action, State } from '../../../config/interfaces';

import {
  initialAction,
  initialState,
} from '../../../config'

import {
  JOURNALFETCH,
  JOURNALSUCCESS,
  JOURNALFAIL,
  JOURNALFILTERVALUE,
} from '../config/ConstantsJournal';

export function ReducerJournal(state: State = initialState, action: Action = initialAction) {
  switch (action.type) {
    case JOURNALFETCH:
      return {
        ...state,
        fetch: true,
        data: action.data,
        action: action.type,
      };

    case JOURNALSUCCESS:
      return {
        ...state,
        fetch: false,
        res: action.data,
        action: action.type,
      };

    case JOURNALFAIL:
      return {
        ...state,
        fetch: false,
        err: action.data,
        action: action.type,
      };

    case JOURNALFILTERVALUE:
      return {
        ...state,
        fetch: true,
        data: action.data,
      };

    default:
      return state;
  }
}
