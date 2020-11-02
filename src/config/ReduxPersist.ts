/**
 * @author: dwi.setiyadi@gmail.com
*/

import storage from 'redux-persist/lib/storage';
import createEncryptor from 'redux-persist-transform-encrypt';
import { createBlacklistFilter } from 'redux-persist-transform-filter';

const encryptor = createEncryptor({
  secretKey: 'abang-baso-jangan-kasih-tau-sipa-siapa-ya',
  onError(error) {
    console.log('createEncryptor error ', error); // eslint-disable-line
  },
});

const saveAuthSubsetBlacklistFilter = createBlacklistFilter(
  'auth',
  ['data', 'action'],
);

const REDUX_PERSIST = {
  active: true,
  reducerVersion: '1.0',
  storeConfig: {
    key: 'root',
    storage,
    // whitelist: ['auth', 'notification', 'organizationAll'],
    transforms: [saveAuthSubsetBlacklistFilter, encryptor],
  },
};

export default REDUX_PERSIST;
