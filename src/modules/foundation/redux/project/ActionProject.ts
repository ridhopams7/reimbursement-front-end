import {
  PROJECTBYORGFETCH,
  PROJECTBYORGSUCCESS,
  PROJECTBYORGFAILED,

  PROJECTALLFETCH,
  PROJECTALLSUCCESS,
  PROJECTALLFAILED,
} from '../../config';

export const projectByOrgFetch = (value: object) => ({ type: PROJECTBYORGFETCH, data: value });
export const projectByOrgSuccess = (value: object) => ({ type: PROJECTBYORGSUCCESS, data: value });
export const projectByOrgFailed = (value: object) => ({ type: PROJECTBYORGFAILED, data: value });

export const projectAllFetch = (value: object) => ({ type: PROJECTALLFETCH, data: value });
export const projectAllSuccess = (value: object) => ({ type: PROJECTALLSUCCESS, data: value });
export const projectAllFailed = (value: object) => ({ type: PROJECTALLFAILED, data: value });

