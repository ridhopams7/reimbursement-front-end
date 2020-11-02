/**
 * @author: dwi.setiyadi@gmail.com
*/

import {
  State,
  initialState,
  Action,
  initialAction,
  NOWPLAYINGFETCH,
  NOWPLAYINGSUCCESS,
  NOWPLAYINGFAIL,
} from './ConfigDashboard';

export function ReducerNowPlayingDashboard(state: State = initialState, action: Action = initialAction) {
  switch (action.type) {
    case NOWPLAYINGFETCH:
      return {
        ...state,
        fetch: true,
        data: action.data,
        action: action.type,
      };

    case NOWPLAYINGSUCCESS:
      return {
        ...state,
        fetch: false,
        res: action.data,
        action: action.type,
      };

    case NOWPLAYINGFAIL:
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
