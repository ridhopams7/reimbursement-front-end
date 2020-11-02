/**
 * @author: dwi.setiyadi@gmail.com
*/

import storage from 'redux-persist/lib/storage';
import { USERLOGOUT } from '../modules/auth/config/ConstantsAuth';

const HookReducer: any = (state: any, action: any) => {
  // do your hook here
  if (action.type === USERLOGOUT) {
    storage.removeItem('persist:root');
    state = undefined;
  }

  return { state, action };
};

export default HookReducer;
