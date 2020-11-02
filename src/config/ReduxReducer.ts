/**
 * @author: dwi.setiyadi@gmail.com
*/

/*
Startup Examples:

import { ReducerSome } from '../modules/auth/ReducerSome';
const reducers: object = {
  some: ReducerSome,
};
export default reducers;
*/

import { ReducerNowPlayingDashboard } from '../modules/dashboard/ReducerDashboard';
import { ReducerAuth } from '../modules/auth/redux';
import { ReducerJournal } from '../modules/automatic-journal/redux/ReducerJournal';
import { ReducerVoucher } from '../modules/voucher/redux/ReducerVoucher';
import {
  ReducerAccount,
  ReducerAccountingPeriodAll,
  ReducerAccountingPeriodByState,
  ReducerAccountingPeriodDateByState,
  ReducerCostCenterByOrg,
  ReducerCurrency,
  ReducerCustomerByOrg,
  ReducerOrganizationAll,
  ReducerOrganizationById,
  ReducerProductByOrg,
  ReducerProjectByOrg,
  ReducerTransCatByOrg,
  ReducerCostCenterAll,
  ReducerCustomerAll,
  ReducerProductAll,
  ReducerProjectAll,
} from '../modules/foundation/redux';


const reducers: object = {
  nowPlaying: ReducerNowPlayingDashboard,
  auth: ReducerAuth,
  automaticJournal: ReducerJournal,
  voucher: ReducerVoucher,
  account: ReducerAccount,
  accPeriodAll: ReducerAccountingPeriodAll,
  accPeriodByState: ReducerAccountingPeriodByState,
  accPeriodDateByState: ReducerAccountingPeriodDateByState,
  costCenterByOrg: ReducerCostCenterByOrg,
  currency: ReducerCurrency,
  customerByOrg: ReducerCustomerByOrg,
  organizationAll: ReducerOrganizationAll,
  organizationById: ReducerOrganizationById,
  productByOrg: ReducerProductByOrg, 
  projectByOrg: ReducerProjectByOrg,
  transCatByOrg: ReducerTransCatByOrg,
  costCenterAll: ReducerCostCenterAll,
  customerAll: ReducerCustomerAll,
  productAll: ReducerProductAll,
  projectAll: ReducerProjectAll,
};

export default reducers;
