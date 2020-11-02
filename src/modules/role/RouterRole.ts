import React from 'react';

const routes = [
    {
        path: '/',
        exact: true,
        name: 'Home', 
    },
    {
        path: '/user/role',
        exact: true,
        name: 'Role',
        component: React.lazy(() => import('./views/ListRole')),
    },
    { 
        path: '/user/role/create',
        exact: true,
        name: 'Create',
        component: React.lazy(() => import('./views/CreateRole')),
    },
    {
        path: '/user/role/update/:roleDataId',
        name: 'Update',
        exact: true,
        component: React.lazy(() => import('./views/UpdateRole')),
    },
    {
        path: '/user/role/menu/:roleDataId',
        name: 'Menu',
        exact: true,
        component: React.lazy(() => import('./views/DetailMenu')),
    },
    {
        path: '/user/role/user/:roleDataId',
        name: 'User',
        exact: true,
        component: React.lazy(() => import('./views/DetailUser')),
    },
       
];

export default routes;
