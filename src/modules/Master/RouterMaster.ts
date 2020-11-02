import React from 'react';

const routes = [
    {
        path: '/',
        exact: true,
        name: 'Home', 
    },
    {
        path: '/master/master-type',
        exact: true,
        name: 'Master Type',
        component: React.lazy(() => import('./master-type/views/ListMaster')),
    },
    { 
        path: '/master/master-type/create',
        exact: true,
        name: 'Create',
        component: React.lazy(() => import('./master-type/views/CreateMasterType')),
    },
    {
        path: '/master/master-type/:masterTypeId',
        name: 'Update',
        component: React.lazy(() => import('./master-type/views/UpdateMasterType')),
    },
    {
        path: '/master/master-data',
        exact: true,
        name: 'Master Data',
        component: React.lazy(() => import('./master-data/views/ListMaster')),
    },
    {
        
        path: '/master/master-data/create',
        exact: true,
        name: 'Create',
        component: React.lazy(() => import('./master-data/views/CreateMasterData')),
    },
    {
        
        path: '/master/master-data/:masterDataId',
        exact: true,
        name: 'Update',
        component: React.lazy(() => import('./master-data/views/UpdateMasterData')),
    },
    
];

export default routes;
