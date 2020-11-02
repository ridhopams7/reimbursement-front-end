import {
  USERLOGINFETCH,
  USERLOGINSUCCESS,
  USERLOGINFAILED,
  USERLOGOUT,
} from '../config';

export const userLoginFetch = (value: object) => ({ type: USERLOGINFETCH, data: value });
export const userLoginSuccess = (value: object) => ({ type: USERLOGINSUCCESS, data: value });
export const userLoginFailed = (value: object) => ({ type: USERLOGINFAILED, data: value });
export const userLogout = () => ({ type: USERLOGOUT });