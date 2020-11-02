import {
  PRODUCTBYORGFETCH,
  PRODUCTBYORGSUCCESS,
  PRODUCTBYORGFAILED,

  PRODUCTALLFETCH,
  PRODUCTALLSUCCESS,
  PRODUCTALLFAILED,
} from '../../config';

export const productByOrgFetch = (value: object) => ({ type: PRODUCTBYORGFETCH, data: value });
export const productByOrgSuccess = (value: object) => ({ type: PRODUCTBYORGSUCCESS, data: value });
export const productByOrgFailed = (value: object) => ({ type: PRODUCTBYORGFAILED, data: value });

export const productAllFetch = (value: object) => ({ type: PRODUCTALLFETCH, data: value });
export const productAllSuccess = (value: object) => ({ type: PRODUCTALLSUCCESS, data: value });
export const productAllFailed = (value: object) => ({ type: PRODUCTALLFAILED, data: value });

