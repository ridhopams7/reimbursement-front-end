/**
 * @author: dwi.setiyadi@gmail.com
*/

import { findJsonInString } from './String';

export const sagaWatcherErrorHandling = (error: any) => {
  const parseError = findJsonInString(error);
  // console.log('Error: ', parseError); // eslint-disable-line no-console

  if (parseError.errorMsg !== undefined) return parseError.errorMsg;

  if (parseError.errors !== undefined) {
    const unknownErr = parseError.errors;
    if (unknownErr > 0) return unknownErr[0];
  }

  return 'Unknown Error';
};
