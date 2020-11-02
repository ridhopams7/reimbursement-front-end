export const initialState = {
  fetch: false,
  data: null,
  res: null,
  err: null,
};

export const initialAction = {
  type: 'DEFAULT',
  data: null,
};


export const initialPage = {
  pagenumber: 0,
  direction: "ASC",
  order: 'headerCode',
  pageSize: 5,
};

export const ajRoles = {
  AJ_View: 'AJ_View',
  AJ_Entry: 'AJ_Entry',
  AJ_Save: 'AJ_Save',
  AJ_Remove: 'AJ_Remove',
  AJ_PostToGl: 'AJ_PostToGl',
  AJ_CreateCorrection: 'AJ_CreateCorrection',
};


export const userMenu = {
  User_Menu_View: 'USER_MENU_VIEW',
  User_Menu_Entry: 'USER_MENU_ENTRY',
  User_Menu_Save: 'USER_MENU_SAVE',
  User_Menu_Remove: 'USER_MENU_REMOVE',
};

export const userRole = {
  User_Role_View: 'USER_ROLE_VIEW',
  User_Role_Entry: 'USER_ROLE_ENTRY',
  User_Role_Save: 'USER_ROLE_SAVE',
  User_Role_Remove: 'USER_ROLE_REMOVE',
};

export const userUser = {
  User_Apps_View: 'USER_APPS_VIEW',
  User_Apps_Entry: 'USER_APPS_ENTRY',
  User_Apps_Save: 'USER_APPS_SAVE',
  User_Apps_Remove: 'USER_APPS_REMOVE',
};

export const const_masterType = {
  Master_Type_View: 'MASTER_TYPE_VIEW',
  Master_Type_Entry: 'MASTER_TYPE_ENTRY',
  Master_Type_Save: 'MASTER_TYPE_SAVE',
  Master_Type_Remove: 'MASTER_TYPE_REMOVE',
};

export const const_masterData = {
  Master_Data_View: 'MASTER_DATA_VIEW',
  Master_Data_Entry: 'MASTER_DATA_ENTRY',
  Master_Data_Save: 'MASTER_DATA_SAVE',
  Master_Data_Remove: 'MASTER_DATA_REMOVE',
};

export const parentMenu = {
  ReimbursementView: 'REIMBURSEMENT_VIEW',
  MasterView: 'MASTER_VIEW',
  UserManagementView: 'USER_MANAGEMENT_VIEW',
}
export const reimbursementTransactionRole = {
 
  Reimbursement_Transaction_View: 'REIMBURSEMENT_TRANSACTION_VIEW',
  Reimbursement_Transaction_Entry: 'REIMBURSEMENT_TRANSACTION_ENTRY',
  Reimbursement_Transaction_Posting: 'REIMBURSEMENT_TRANSACTION_POSTING',
  Reimbursement_Transaction_Save: 'REIMBURSEMENT_TRANSACTION_SAVE',
  Reimbursement_Transaction_Remove: 'REIMBURSEMENT_TRANSACTION_REMOVE',
};

export const reimbursementApprovalRole = {
  Reimbursement_Approval_View: 'REIMBURSEMENT_APPROVAL_VIEW',
  Reimbursement_Approval_Approved: 'REIMBURSEMENT_APPROVAL_APPROVED',
  Reimbursement_Approval_Rejected: 'REIMBURSEMENT_APPROVAL_REJECTED',
};


export const voucherRoles = {
  V_View: 'V_View',
  V_Entry: 'V_Entry',
  V_Save: 'V_Save',
  V_Remove: 'V_Remove',
  V_PostToGl: 'V_PostToGl', 
  V_Duplicate: 'V_Duplicate',
};

export const materialRoles = {
  Mat_View: 'V_View',
  Mat_Entry: 'V_Entry',
  Mat_Save: 'V_Save',
  Mat_Remove: 'V_Remove',
};

export const reportRoles = {
  R_View: 'R_View',
  R_GJ_View: 'R_GJ_View',
  R_GL_View: 'R_GL_View',
  Report_View: 'REPORT_VIEW'
};

export const masterRoles = {
  MD_View: 'MD_View',
};

export const statusName = [
  { id: '0', name: 'Open' },
  { id: '1', name: 'In PIC' },
  { id: '2', name: 'In HRD' }, 
  { id: '3', name: 'In Finance' },
  { id: '4', name: 'disbursement' },
];

export const approvalCode = [
  { id: 'PM', code: '1' },
  { id: 'HRD', code: '2' },
  { id: 'Finance', code: '3' }, 
  { id: 'CEO', code: '4' },
];

export const approvalId = [
  { id: 'PM', code: 1 },
  { id: 'HRD', code: 2 },
  { id: 'Finance', code: 3 }, 
  { id: 'CEO', code: 4 },
];
