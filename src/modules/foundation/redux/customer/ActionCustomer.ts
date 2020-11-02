import {
  CUSTOMERBYORGFETCH,
  CUSTOMERBYORGSUCCESS,
  CUSTOMERBYORGFAILED,

  CUSTOMERALLFETCH,
  CUSTOMERALLSUCCESS,
  CUSTOMERALLFAILED,
} from '../../config';

export const customerByOrgFetch = (value: object) => ({ type: CUSTOMERBYORGFETCH, data: value });
export const customerByOrgSuccess = (value: object) => ({ type: CUSTOMERBYORGSUCCESS, data: value });
export const customerByOrgFailed = (value: object) => ({ type: CUSTOMERBYORGFAILED, data: value });

export const customerAllFetch = (value: object) => ({ type: CUSTOMERALLFETCH, data: value });
export const customerAllSuccess = (value: object) => ({ type: CUSTOMERALLSUCCESS, data: value });
export const customerAllFailed = (value: object) => ({ type: CUSTOMERALLFAILED, data: value });
