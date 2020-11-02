import React from 'react';

const routes = [
  {
    path: '/automatic-journal',
    exact: true,
    name: 'Automatic Journal',
    component: React.lazy(() => import('./views/ViewTransactionJournal')),
  }, 
  {
    path: '/automatic-journal/detail/:headerId',
    exact: true,
    name: 'Detail',
    component: React.lazy(() => import('./views/CreateTransactionJournal')),
  },
  {
    path: '/automatic-journal/create',
    name: 'Create',
    component: React.lazy(() => import('./views/CreateTransactionJournal')),
  },
  // {
  //   path: '/automatic-journal/detail/:id',
  //   name: 'Automatic Journal - Detail',
  //   component: React.lazy(() => import('./views')),
  // },
  // {
  //   path: '/automatic-journal/update/:id',
  //   name: 'Automatic Journal - Update',
  //   component: React.lazy(() => import('./views')),
  // },
];

export default routes;
