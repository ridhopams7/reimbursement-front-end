import React from 'react';

const routes = [
  {
    path: '/sample-crud',
    exact: true,
    name: 'Vouchers',
    component: React.lazy(() => import('./views/SummaryVouchers')),
  },
  {
    path: '/sample-crud/create',
    name: 'Vouchers - Create',
    component: React.lazy(() => import('./views/CreateVouchers')),
  },
  {
    path: '/sample-crud/read/:id',
    name: 'Vouchers - Detail',
    component: React.lazy(() => import('./views/ReadVouchers')),
  },
  {
    path: '/sample-crud/update/:id',
    name: 'Vouchers - Update',
    component: React.lazy(() => import('./views/UpdateVouchers')),
  },
];

export default routes;
