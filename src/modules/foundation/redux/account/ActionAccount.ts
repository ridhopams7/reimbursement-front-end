import {
  ACCOUNTFETCH,
  ACCOUNTSUCCESS,
  ACCOUNTFAILED,
} from '../../config';

export const accountFetch = (value: object) => ({ type: ACCOUNTFETCH, data: value });
export const accountSuccess = (value: object) => ({ type: ACCOUNTSUCCESS, data: value });
export const accountFailed = (value: object) => ({ type: ACCOUNTFAILED, data: value });
