import {
  TRANSCATBYORGFETCH,
  TRANSCATBYORGSUCCESS,
  TRANSCATBYORGFAILED,
} from '../../config';

export const transCatByOrgFetch = (value: object) => ({ type: TRANSCATBYORGFETCH, data: value });
export const transCatByOrgSuccess = (value: object) => ({ type: TRANSCATBYORGSUCCESS, data: value });
export const transCatByOrgFailed = (value: object) => ({ type: TRANSCATBYORGFAILED, data: value });
