import { reimbursementTransactionRole, reimbursementApprovalRole, const_masterType, const_masterData, userUser, userRole, userMenu, parentMenu , reportRoles} from '../../../config';


export default {
  items: [
    {
      name: 'Dashboard',
      url: '#',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'NEW',
      },
    },
    {
      title: true,
      name: 'Modules',
      wrapper: { // optional wrapper object
        element: '', // required valid HTML5 element tag
        attributes: {}, // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: '', // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Reimbursement',
      url: '/reimbursement',
      icon: 'fa fa-ticket',
      accessCode: parentMenu.ReimbursementView,
      children: [
        {
          name: 'Transaction',
          url: '/reimbursement/transaction',
          icon: 'fa fa-pencil',
          accessCode: reimbursementTransactionRole.Reimbursement_Transaction_View,
        },
        {
          name: 'Approval',
          url: '/reimbursement/approval',
          icon: 'fa fa-list',
          accessCode: reimbursementApprovalRole.Reimbursement_Approval_View,
        },
      ]
    },
    // {
    //   name: 'Reimbursement',
    //   url: '/reimbursement',
    //   icon: 'fa fa-ticket',
    //   // accessCode: ajRoles.AJ_View,
    // },
    // {
    //   name: 'Voucher',
    //   url: '/voucher',
    //   icon: 'fa fa-ticket',
    //   accessCode: voucherRoles.V_View,
    // },
    {
      name: 'Master',
      url: '/master',
      icon: 'fa fa-tasks',
      accessCode: parentMenu.MasterView,
      children: [
        {
          name: 'Master Type',
          url: '/master/master-type',
          icon: 'fa fa-hashtag',
          accessCode: const_masterType.Master_Type_View,
        },
        {
          name: 'Master Data',
          url: '/master/master-data',
          icon: 'fa fa-magic',
          accessCode: const_masterData.Master_Data_View,
        },
      ]
    },
    {
      name: 'Report',
      url: '/report',
      icon: 'fa fa-line-chart',
      accessCode: reportRoles.Report_View,
      children: [
        {
          name: 'General Journal',
          url: '/report/general-journal',
          icon: 'fa fa-file-text-o',
          accessCode: reportRoles.Report_View,
        },
        // {
        //   name: 'General Ledger',
        //   url: '/report/general-ledger',
        //   icon: 'fa fa-file-text-o',
        //   // accessCode: reportRoles.R_GL_View,
        // },
      ]
    },
    {
      name: 'User Management',
      url: '/user',
      icon: 'fa fa-users',
      accessCode: parentMenu.UserManagementView,
      children: [
        {
          name: 'User',
          url: '/user/users',
          icon: 'fa fa-user',
          accessCode: userUser.User_Apps_View,
        },
        {
          name: 'Role',
          url: '/user/role',
          icon: 'fa fa-tag',
          accessCode: userRole.User_Role_View,
        },
        {
          name: 'Menu',
          url: '/user/menu',
          icon: 'fa fa-tags',
          accessCode: userMenu.User_Menu_View,
        },
      ]
    },
  ],
};
