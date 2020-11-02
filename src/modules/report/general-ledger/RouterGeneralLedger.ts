import React from 'react';

const routes = [
  {
    path: '/',
    exact: true,
    name: 'Home',
  },
  {
    path: '/report/general-ledger',
    name: 'General Ledger',
    component: React.lazy(() => import('./views/GeneralLedger')),
  },
];

export default routes;
