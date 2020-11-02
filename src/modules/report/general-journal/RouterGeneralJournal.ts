import React from 'react';

const routes = [
  {
    path: '/',
    exact: true,
    name: 'Home',
  },
  {
    path: '/report/general-journal',
    name: 'General Journal',
    component: React.lazy(() => import('./views/GeneralJournal')),
  },
];

export default routes;
