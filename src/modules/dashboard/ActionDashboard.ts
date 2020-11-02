/**
 * @author: dwi.setiyadi@gmail.com
*/

import {
  NOWPLAYINGFETCH,
  NOWPLAYINGREQUEST,
  NOWPLAYINGSUCCESS,
  NOWPLAYINGFAIL,
  NOWPLAYINGCHANGEVALUE,
} from './ConfigDashboard';

export const nowPlayingFetch = (value: object) => ({ type: NOWPLAYINGFETCH, data: value });
export const nowPlayingRequest = (value: object) => ({ type: NOWPLAYINGREQUEST, data: value });
export const nowPlayingSuccess = (value: object) => ({ type: NOWPLAYINGSUCCESS, data: value });
export const nowPlayingFail = (value: object) => ({ type: NOWPLAYINGFAIL, data: value });
export const nowPlayingChangeValue = (value: object) => ({ type: NOWPLAYINGCHANGEVALUE, data: value });
