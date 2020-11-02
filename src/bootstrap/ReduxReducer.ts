/**
 * @author: dwi.setiyadi@gmail.com
*/

import { combineReducers } from 'redux';
import { ReduxReducer as LoadReducers, HookReducer } from '../config';

let reduxReducer: any = combineReducers(LoadReducers);

if (Object.keys(LoadReducers).length === 0 && LoadReducers.constructor === Object) {
  const initialReducer: any = (state: any = [], action: any) => state;
  reduxReducer = combineReducers({ initialReducer } as any);
}

const hooks: any = (state: any, action: any) => {
  const hook = HookReducer(state, action);
  return reduxReducer(hook.state, hook.action);
}

export default hooks;
