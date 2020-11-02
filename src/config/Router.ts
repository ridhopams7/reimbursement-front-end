/**
 * @author: dwi.setiyadi@gmail.com
*/

import React from 'react';

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config

import RouterExample from '../modules/example/RouterExample';
import RouterDashboard from '../modules/dashboard/RouterDashboard';
import RouterAutomaticJournal from '../modules/automatic-journal/RouterAutomaticJournal';
import RouterVoucher from '../modules/voucher/RouterVoucher';
import RouterVouchers from '../modules/vouchers/RouterVouchers';
import RouterGeneralJournalReport from '../modules/report/general-journal/RouterGeneralJournal';
import RouterGeneralLedgerReport from '../modules/report/general-ledger/RouterGeneralLedger';
import RouterMaster from '../modules/Master/RouterMaster';
import RouterReimbursement from '../modules/Reimbursement/RouterReimbursement';
import RouterRole from '../modules/role/RouterRole';
import RouterMenu from '../modules/menu/RouterMenu';
import RouterUser from '../modules/user/RouterUser';

export const RouterContainer = [
  ...RouterExample,
  ...RouterDashboard,
  ...RouterAutomaticJournal,
  ...RouterVoucher,
  ...RouterVouchers,
  ...RouterGeneralJournalReport,
  ...RouterGeneralLedgerReport,
  ...RouterMaster,
  ...RouterReimbursement,
  ...RouterRole,
  ...RouterMenu,
  ...RouterUser,
];

export const RouterNonContainer = [
  {
    path: '/login',
    exact: true,
    name: 'Login',
    component: React.lazy(() => import('../modules/auth/views/LoginAuth')),
  },
  {
    path: '/register',
    exact: true,
    name: 'Register',
    component: React.lazy(() => import('../modules/auth/views/RegisterAuth')),
  },
  {
    path: '/404',
    exact: true,
    name: '404 Not Found',
    component: React.lazy(() => import('../modules/example/views/Pages/Page404/Page404')),
  },
  {
    path: '/500',
    exact: true,
    name: '500 Internal Server Error',
    component: React.lazy(() => import('../modules/example/views/Pages/Page500/Page500')),
  },

];
