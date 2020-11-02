/**
* @author: dwi.setiyadi@gmail.com
*/

import React from 'react';

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  {
    path: '/',
    exact: true,
    name: 'Home',
    component: React.lazy(() => import('./views/Home')),
  },
  // {
  //   path: '/dashboard',
  //   name: 'Dashboard',
  //   component: React.lazy(() => import('./views/Home')),
  // },
  
];

export default routes;
