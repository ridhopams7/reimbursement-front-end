/**
 * @author: dwi.setiyadi@gmail.com
*/

export interface State {
  fetch: boolean,
  data: any,
  res: any,
  err: any,
}

export interface Action {
  type: string,
  data: any,
}

export const initialState = {
  fetch: false,
  data: null,
  res: null,
  err: null,
};

export const initialAction = {
  type: 'DEFAULT',
  data: null,
};

export const NOWPLAYINGENDPOINT = 'discover/movie';
export const NOWPLAYINGFETCH = 'NOWPLAYINGFETCH';
export const NOWPLAYINGREQUEST= 'NOWPLAYINGREQUEST';
export const NOWPLAYINGSUCCESS = 'NOWPLAYINGSUCCESS';
export const NOWPLAYINGFAIL = 'NOWPLAYINGFAIL';
export const NOWPLAYINGCHANGEVALUE = 'NOWPLAYINGCHANGEVALUE';


