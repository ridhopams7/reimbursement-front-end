/**
 * @author: dwi.setiyadi@gmail.com
*/

/*
Startup Examples:

import { watcherModules } from '../modules/some/SagaSome';
export default [
  ...watcherModules,
];
*/

import { watcherNowPlaying } from '../modules/dashboard/SagaDashboard';
import { watcherSagaLogin } from '../modules/auth/redux';
import {
  watcherSagaAccount,
  watcherSagaAccountingPeriod,
  watcherSagaCostCenter,
  watcherSagaCurrency,
  watcherSagaCustomer,
  watcherSagaOrganization,
  watcherSagaProduct,
  watcherSagaProject,
  watcherSagaTransCat,
} from '../modules/foundation/redux';

export default [
  ...watcherNowPlaying,
  ...watcherSagaLogin,
  ...watcherSagaAccount,
  ...watcherSagaAccountingPeriod,
  ...watcherSagaCostCenter,
  ...watcherSagaCurrency,
  ...watcherSagaCustomer,
  ...watcherSagaOrganization,
  ...watcherSagaProduct,
  ...watcherSagaProject,
  ...watcherSagaTransCat,
];
