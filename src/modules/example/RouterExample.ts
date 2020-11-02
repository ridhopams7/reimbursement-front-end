import React from 'react';

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  {
    path: '/example',
    exact: true,
    name: 'Example',
    component: React.lazy(() => import('./views/Dashboard/Dashboard')),
  },
  {
    path: '/example/dashboard',
    name: 'Example Dashboard',
    component: React.lazy(() => import('./views/Dashboard/Dashboard')),
  },
  {
    path: '/example/theme',
    exact: true,
    name: 'Theme',
    component: React.lazy(() => import('./views/Theme/Colors/Colors')),
  },
  {
    path: '/example/theme/colors',
    name: 'Colors',
    component: React.lazy(() => import('./views/Theme/Colors/Colors')),
  },
  {
    path: '/example/theme/typography',
    name: 'Typography',
    component: React.lazy(() => import('./views/Theme/Typography/Typography')),
  },
  {
    path: '/example/base',
    exact: true,
    name: 'Base',
    component: React.lazy(() => import('./views/Base/Cards/Cards')),
  },
  {
    path: '/example/base/cards',
    name: 'Cards',
    component: React.lazy(() => import('./views/Base/Cards/Cards')),
  },
  {
    path: '/example/base/forms',
    name: 'Forms',
    component: React.lazy(() => import('./views/Base/Forms/Forms')),
  },
  {
    path: '/example/base/switches',
    name: 'Switches',
    component: React.lazy(() => import('./views/Base/Switches/Switches')),
  },
  {
    path: '/example/base/tables',
    name: 'Tables',
    component: React.lazy(() => import('./views/Base/Tables/Tables')),
  },
  {
    path: '/example/base/tabs',
    name: 'Tabs',
    component: React.lazy(() => import('./views/Base/Tabs/Tabs')),
  },
  {
    path: '/example/base/breadcrumbs',
    name: 'Breadcrumbs',
    component: React.lazy(() => import('./views/Base/Breadcrumbs/Breadcrumbs')),
  },
  {
    path: '/example/base/carousels',
    name: 'Carousel',
    component: React.lazy(() => import('./views/Base/Carousels/Carousels')),
  },
  {
    path: '/example/base/collapses',
    name: 'Collapse',
    component: React.lazy(() => import('./views/Base/Collapses/Collapses')),
  },
  {
    path: '/example/base/dropdowns',
    name: 'Dropdowns',
    component: React.lazy(() => import('./views/Base/Dropdowns/Dropdowns')),
  },
  {
    path: '/example/base/jumbotrons',
    name: 'Jumbotrons',
    component: React.lazy(() => import('./views/Base/Jumbotrons/Jumbotrons')),
  },
  {
    path: '/example/base/list-groups',
    name: 'List Groups',
    component: React.lazy(() => import('./views/Base/ListGroups/ListGroups')),
  },
  {
    path: '/example/base/navbars',
    name: 'Navbars',
    component: React.lazy(() => import('./views/Base/Navbars/Navbars')),
  },
  {
    path: '/example/base/navs',
    name: 'Navs',
    component: React.lazy(() => import('./views/Base/Navs/Navs')),
  },
  {
    path: '/example/base/paginations',
    name: 'Paginations',
    component: React.lazy(() => import('./views/Base/Paginations/Pagnations')),
  },
  {
    path: '/example/base/popovers',
    name: 'Popovers',
    component: React.lazy(() => import('./views/Base/Popovers/Popovers')),
  },
  {
    path: '/example/base/progress-bar',
    name: 'Progress Bar',
    component: React.lazy(() => import('./views/Base/ProgressBar/ProgressBar')),
  },
  {
    path: '/example/base/tooltips',
    name: 'Tooltips',
    component: React.lazy(() => import('./views/Base/Tooltips/Tooltips')),
  },
  {
    path: '/example/buttons',
    exact: true,
    name: 'Buttons',
    component: React.lazy(() => import('./views/Buttons/Buttons/Buttons')),
  },
  {
    path: '/example/buttons/buttons',
    name: 'Buttons',
    component: React.lazy(() => import('./views/Buttons/Buttons/Buttons')),
  },
  {
    path: '/example/buttons/button-dropdowns',
    name: 'Button Dropdowns',
    component: React.lazy(() => import('./views/Buttons/ButtonDropdowns/ButtonDropdowns')),
  },
  {
    path: '/example/buttons/button-groups',
    name: 'Button Groups',
    component: React.lazy(() => import('./views/Buttons/ButtonGroups/ButtonGroups')),
  },
  {
    path: '/example/buttons/brand-buttons',
    name: 'Brand Buttons',
    component: React.lazy(() => import('./views/Buttons/BrandButtons/BrandButtons')),
  },
  {
    path: '/example/icons',
    exact: true,
    name: 'Icons',
    component: React.lazy(() => import('./views/Icons/CoreUIIcons/CoreUIIcons')),
  },
  {
    path: '/example/icons/coreui-icons',
    name: 'CoreUI Icons',
    component: React.lazy(() => import('./views/Icons/CoreUIIcons/CoreUIIcons')),
  },
  {
    path: '/example/icons/flags',
    name: 'Flags',
    component: React.lazy(() => import('./views/Icons/Flags/Flags')),
  },
  {
    path: '/example/icons/font-awesome',
    name: 'Font Awesome',
    component: React.lazy(() => import('./views/Icons/FontAwesome/FontAwesome')),
  },
  {
    path: '/example/icons/simple-line-icons',
    name: 'Simple Line Icons',
    component: React.lazy(() => import('./views/Icons/SimpleLineIcons/SimpleLineIcons')),
  },
  {
    path: '/example/notifications',
    exact: true,
    name: 'Notifications',
    component: React.lazy(() => import('./views/Notifications/Alerts/Alerts')),
  },
  {
    path: '/example/notifications/alerts',
    name: 'Alerts',
    component: React.lazy(() => import('./views/Notifications/Alerts/Alerts')),
  },
  {
    path: '/example/notifications/badges',
    name: 'Badges',
    component: React.lazy(() => import('./views/Notifications/Badges/Badges')),
  },
  {
    path: '/example/notifications/modals',
    name: 'Modals',
    component: React.lazy(() => import('./views/Notifications/Modals/Modals')),
  },
  {
    path: '/example/widgets',
    name: 'Widgets',
    component: React.lazy(() => import('./views/Widgets/Widgets')),
  },
  {
    path: '/example/charts',
    name: 'Charts',
    component: React.lazy(() => import('./views/Charts/Charts')),
  },
  {
    path: '/example/users',
    exact: true,
    name: 'Users',
    component: React.lazy(() => import('./views/Users/Users')),
  },
  {
    path: '/example/users/:id',
    exact: true,
    name: 'User Details',
    component: React.lazy(() => import('./views/Users/User')),
  },
  {
    path: '/example/login',
    exact: true,
    name: 'Login Page',
    component: React.lazy(() => import('./views/Pages/Login/Login')),
  },
  {
    path: '/example/register',
    exact: true,
    name: 'Register Page',
    component: React.lazy(() => import('./views/Pages/Register/Register')),
  },
  {
    path: '/example/404',
    exact: true,
    name: 'Page 404',
    component: React.lazy(() => import('./views/Pages/Page404/Page404')),
  },
  {
    path: '/example/500',
    exact: true,
    name: 'Page 500',
    component: React.lazy(() => import('./views/Pages/Page500/Page500')),
  },
];

export default routes;
