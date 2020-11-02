export const REIMBURSEMENTLISTENDPOINT = 'reimbursements';
export const REIMBURSEMENTAPPROVALLISTENDPOINT = 'reimbursements-approval';
export const MasterTypeClientId = 'c1504188-0100-4d99-966c-3c8519f4e4b1';
export const MasterTypeProjectId = 'ae5c68f6-dfa9-4741-b9e6-f4e8e8d14113';
export const MasterTypeTransactionId = '3c2d8596-5659-4294-ae8a-71d40ac53484';
export const VOUCHERFILTERVALUE = 'VOUCHERFILTERVALUE';

export const initialPage = {
  pagenumber: 0,
  direction: "DESC",
  order: 'accountingDate',
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
];

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
  Remove: "Remove",
  Posting: "Posting",
  Approved: "Approved",
  Rejected: "Rejected",
}

export const dataLineFormat: any = {
  lineNo: "",
  description: "",
  transactionId: "",
  transactionCode: "",
  transactionName: "",
  amount: "",
  createdBy: "",
  createdDate: "",
  lastUpdatedBy: "",
  lastUpdatedDate: ""
}


export const saveFormat: any = {
  reimbursement: {},
  reimbursementDetail: [],
  totalEvidence: 0,
};

export const defaultComboBox = {
  organizations: [],
  products: [],
  projects: [],
  costcenters: [],
  customers: [],
  postingstates: [],
  transactioncategorys: [],
  transactionsubcategorys: [],
  AccountingPeriods: [],
};

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

export const defaultReimbursementList = {
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


export const defaultCombobox = {
  projects: [],
  projectsByClients: [],
  clients: [],
  pics: [],
  transactions: [],
  accountingPeriods: [],
};
export const defaultEvidence = {
  Evidence: [],
  NewEvidence: [],
  DeleteEvidence: [],
};
export const defaultReimbursement = {
  id: '',
  code: '',
  accountingPeriodId: '',
  accountingPeriodCode: '',
  clientId: '',
  clientCode: '',
  clientName: '',
  projectId: '',
  projectCode: '',
  projectName: '',
  picId: '',
  picCode: '',
  picName: '',
  actualAmount: '',
  description: '',
  needApproved: '',
  isPosted: '',
  createdBy: '',
  createdDate: '',
  lastUpdatedBy: '',
  lastUpdatedDate: '',
  activeFlag: '',
};
