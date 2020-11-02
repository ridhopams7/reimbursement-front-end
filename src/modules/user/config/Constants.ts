export const USERENDPOINT = 'users';
export const USERSENDPOINT = 'master-types';

export const initialPage = {
  pagenumber: 0,
  direction: "DESC",
  order: 'createdDate',
  pageSize: 10,
};
export const headersAuth = {
  Authorization: `Bearer `,
};
export const postingStateList: any = {
  'UP': 'Unposted',
  'PS': 'Posted',
}

export const journalEntryTypeList = [
  { id: 'A', name: 'Actual' },
  { id: 'B', name: 'Budget' },
]

export const journalCategoryList = [
  { id: '', name: 'Select Category' },
  { id: 'RG', name: 'Reguler' },
  { id: 'OP', name: 'Open' },
  { id: 'CL', name: 'Close' },
]

export const ActionAlert: any = {
  Close: "Close",
  Correction: "Correction",
  Duplicate: "Duplicate",
  Save: "Save",
  Remove: "Remove",
  PostGL: "PostGL",
}


export const defaultRequest = {
  totalItems: 0,
  currentPage: 0,
  pageSize: 0,
  totalPages: 0,
  startPage: 0,
  endPage: 0,
  startIndex: 0,
  endIndex: 0,
  pages: [],
  direction: '',
  orderBy: ''
};

export const defaultUserList = {
  content: [],
  first: 1,
  last: 0,
  page: 0,
  pageSize: 10,
  totalElements: 0,
};

export const defaultFilter = {
  dtpCreatedDateFrom: '',
  dtpCreatedDateTo: '',
  txtSearch: '',
};

export const defaultUserData = {
  userName: '',
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  createdBy: '',
  createdDate: '',
  lastUpdatedBy: '',
  lastUpdatedDate: '',
  activeFlag: '',
};
