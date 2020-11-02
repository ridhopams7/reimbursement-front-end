import React from 'react';

const routes = [
    {
        path: '/',
        exact: true,
        name: 'Home',
    },
    {
        path: '/reimbursement/transaction',
        exact: true,
        name: 'Transaction',
        component: React.lazy(() => import('./views/ListReimbursement')),
    },
    {
        path: '/reimbursement/approval',
        exact: true,
        name: 'Approval',
        component: React.lazy(() => import('./views/ListApproval')),
    },
    { 
        path: '/reimbursement/transaction/create',
        exact: true,
        name: 'Create',
        component: React.lazy(() => import('./views/CreateReimbursement')),
    },
    // {
    //     path: '/reimbursement/Create',
    //     name: 'Create',
    //     component: React.lazy(() => import('./views/CreateReimbursement')),
    // },
    {
        path: '/reimbursement/transaction/update/:id',
        exact: true,
        name: 'Update',
        component: React.lazy(() => import('./views/UpdateReimbursement')),
    },
    {
        path: '/reimbursement/approval/detail/:id',
        exact: true,
        name: 'Detail',
        component: React.lazy(() => import('./views/ApprovalReimbursement')),
    },
    
];

export default routes;
