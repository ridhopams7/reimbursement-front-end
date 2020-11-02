import {
  CURRENCYFETCH,
  CURRENCYSUCCESS,
  CURRENCYFAILED,
} from '../../config';

export const currencyFetch = (value: object) => ({ type: CURRENCYFETCH, data: value });
export const currencySuccess = (value: object) => ({ type: CURRENCYSUCCESS, data: value });
export const currencyFailed = (value: object) => ({ type: CURRENCYFAILED, data: value });
