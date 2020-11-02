import React from 'react';

const routes = [
    {
        path: '/',
        exact: true,
        name: 'Home', 
    },
    {
        path: '/user/users',
        exact: true,
        name: 'User',
        component: React.lazy(() => import('./views/ListUser')),
    },
    { 
        path: '/user/users/create',
        exact: true,
        name: 'Create',
        component: React.lazy(() => import('./views/CreateUser')),
    },
    {
        path: '/user/users/:userId',
        name: 'Update',
        exact: true,
        component: React.lazy(() => import('./views/UpdateUser')),
    },
       
];

export default routes;
