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

export const accPeriodAllFetch = (value: object) => ({ type: ACCPERIODALLFETCH, data: value });
export const accPeriodAllSuccess = (value: object) => ({ type: ACCPERIODALLSUCCESS, data: value });
export const accPeriodAllFailed = (value: object) => ({ type: ACCPERIODALLFAILED, data: value });

export const accPeriodByStateFetch = (value: object) => ({ type: ACCPERIODBYSTATEFETCH, data: value });
export const accPeriodByStateSuccess = (value: object) => ({ type: ACCPERIODBYSTATESUCCESS, data: value });
export const accPeriodByStateFailed = (value: object) => ({ type: ACCPERIODBYSTATEFAILED, data: value });

export const accPeriodDateByStateFetch = (value: object) => ({ type: ACCPERIODDATEBYSTATEFETCH, data: value });
export const accPeriodDateByStateSuccess = (value: object) => ({ type: ACCPERIODDATEBYSTATESUCCESS, data: value });
export const accPeriodDateByStateFailed = (value: object) => ({ type: ACCPERIODDATEBYSTATEFAILED, data: value });
