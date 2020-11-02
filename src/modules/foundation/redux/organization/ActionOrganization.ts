import {
  ORGANIZATIONALLFETCH,
  ORGANIZATIONALLSUCCESS,
  ORGANIZATIONALLFAILED,

  ORGANIZATIONBYIDFETCH,
  ORGANIZATIONBYIDSUCCESS,
  ORGANIZATIONBYIDFAILED,
} from '../../config';

export const organizationAllFetch = (value: object) => ({ type: ORGANIZATIONALLFETCH, data: value });
export const organizationAllSuccess = (value: object) => ({ type: ORGANIZATIONALLSUCCESS, data: value });
export const organizationAllFailed = (value: object) => ({ type: ORGANIZATIONALLFAILED, data: value });

export const organizationByIdFetch = (value: object) => ({ type: ORGANIZATIONBYIDFETCH, data: value });
export const organizationByIdSuccess = (value: object) => ({ type: ORGANIZATIONBYIDSUCCESS, data: value });
export const organizationByIdFailed = (value: object) => ({ type: ORGANIZATIONBYIDFAILED, data: value });
