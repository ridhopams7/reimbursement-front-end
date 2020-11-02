import {
  COSTCENTERBYORGFETCH,
  COSTCENTERBYORGSUCCESS,
  COSTCENTERBYORGFAILED,

  COSTCENTERALLFETCH,
  COSTCENTERALLSUCCESS,
  COSTCENTERALLFAILED,
} from '../../config';

export const costCenterByOrgFetch = (value: object) => ({ type: COSTCENTERBYORGFETCH, data: value });
export const costCenterByOrgSuccess = (value: object) => ({ type: COSTCENTERBYORGSUCCESS, data: value });
export const costCenterByOrgFailed = (value: object) => ({ type: COSTCENTERBYORGFAILED, data: value });

export const costCenterAllFetch = (value: object) => ({ type: COSTCENTERALLFETCH, data: value });
export const costCenterAllSuccess = (value: object) => ({ type: COSTCENTERALLSUCCESS, data: value });
export const costCenterAllFailed = (value: object) => ({ type: COSTCENTERALLFAILED, data: value });
