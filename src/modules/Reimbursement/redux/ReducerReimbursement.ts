import { Action, State } from '../../../config/interfaces';

import {
  initialAction,
  initialState,
} from '../../../config'

import {
  VOUCHERFILTERVALUE,
} from '../config/Constants';

export function ReducerVoucher(state: State = initialState, action: Action = initialAction) {
  switch (action.type) {
    case VOUCHERFILTERVALUE:
      return {
        ...state,
        fetch: true,
        data: action.data,
      };

    default:
      return state;
  }
}
