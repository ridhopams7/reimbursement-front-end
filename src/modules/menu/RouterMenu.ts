import React from 'react';

const routes = [
    {
        path: '/',
        exact: true,
        name: 'Home', 
    },
    {
        path: '/user/menu',
        exact: true,
        name: 'Menu',
        component: React.lazy(() => import('./views/ListMenu')),
    },
    { 
        path: '/user/menu/create',
        exact: true,
        name: 'Create',
        component: React.lazy(() => import('./views/CreateMenu')),
    },
    {
        path: '/user/menu/:menuDataId',
        name: 'Update',
        exact: true,
        component: React.lazy(() => import('./views/UpdateMenu')),
    },
       
];

export default routes;
