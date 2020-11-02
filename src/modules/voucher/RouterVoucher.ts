import React from 'react';

const routes = [
  {
    path: '/',
    exact: true,
    name: 'Home',
  },
  {
    path: '/voucher',
    exact: true,
    name: 'Voucher',
    component: React.lazy(() => import('./views/SummaryVoucher')),
  },
  {
    path: '/voucher/Create',
    name: 'Create',
    component: React.lazy(() => import('./views/CreateVoucher')),
  },
  {
    path: '/voucher/detail/:headerId',
    name: 'Detail',
    component: React.lazy(() => import('./views/CreateVoucher')),
  },
  
];

export default routes;
