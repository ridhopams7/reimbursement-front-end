export const JOURNALENDPOINT = 'Journal';
export const VOUCHERLISTENDPOINT = 'je-headers-sample';
export const JOURNALFETCH = 'JOURNALFETCH';
export const JOURNALREQUEST = 'JOURNALREQUEST';
export const JOURNALSUCCESS = 'JOURNALSUCCESS';
export const JOURNALFAIL = 'JOURNALFAIL';
export const JOURNALCHANGEVALUE = 'JOURNALCHANGEVALUE';
export const JOURNALCHANGEPAGE = 'JOURNALCHANGEPAGE';

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
  Remove: "Remove",
  PostGL: "PostGL",
}
export const DataLineFormat: any = {
  account: {
    id: "",
    code: "",
    description: ""
  },
  product: {
    id: "",
    code: "",
    name: ""
  },
  project: {
    id: "",
    code: "",
    name: ""
  },
  costCenter: {
    id: "",
    code: "",
    name: ""
  },
  customer: {
    id: "",
    code: "",
    name: ""
  },
  currency: {
    id: "",
    code: "IDR",
    name: "",
  },
  journalEntryType: {
    id: "A",
    name: "Actual"
  },
  description: "",
  enteredDebit: "",
  accountedDebit: "",
  enteredCredit: "",
  accountedCredit: "",
  exchangeRate: "1",
  isIDR: true,
  attributeField: null,
  referenceField: null,
  ischangeAttribute: false,
  ischangeReference: false,
  attribute1: "",
  attribute2: "",
  attribute3: "",
  attribute4: "",
  attribute5: "",
  attribute6: "",
  attribute7: "",
  attribute8: "",
  attribute9: "",
  attribute10: "",
  reference1: "",
  reference2: "",
  reference3: "",
  reference4: "",
  reference5: "",
  reference6: "",
  reference7: "",
  reference8: "",
  reference9: "",
  reference10: "",
}
export const DataLineFormatActual: any = [{
  account: {
    id: "",
    code: "",
    description: ""
  },
  product: {
    id: "",
    code: "",
    name: ""
  },
  project: {
    id: "",
    code: "",
    name: ""
  },
  costCenter: {
    id: "",
    code: "",
    name: ""
  },
  customer: {
    id: "",
    code: "",
    name: ""
  },
  currency: {
    id: "",
    code: "IDR",
    name: "",
  },
  journalEntryType: {
    id: "A",
    name: "Actual"
  },
  description: "",
  enteredDebit: "",
  accountedDebit: "",
  enteredCredit: "",
  accountedCredit: "",
  exchangeRate: "1",
  isIDR: true,
  attributeField: null,
  referenceField: null,
  evidence: [],
  ischangeAttribute: false,
  ischangeReference: false,
  attribute1: "",
  attribute2: "",
  attribute3: "",
  attribute4: "",
  attribute5: "",
  attribute6: "",
  attribute7: "",
  attribute8: "",
  attribute9: "",
  attribute10: "",
  reference1: "",
  reference2: "",
  reference3: "",
  reference4: "",
  reference5: "",
  reference6: "",
  reference7: "",
  reference8: "",
  reference9: "",
  reference10: "",
}]

export const DataLineFormatClear: any = [{
  account: {
    id: "",
    code: "",
    description: ""
  },
  product: {
    id: "",
    code: "",
    name: ""
  },
  project: {
    id: "",
    code: "",
    name: ""
  },
  costCenter: {
    id: "",
    code: "",
    name: ""
  },
  customer: {
    id: "",
    code: "",
    name: ""
  },
  currency: {
    id: "",
    code: "IDR",
    name: "",
  },
  journalEntryType: {
    id: "A",
    name: "Actual"
  },
  description: "",
  enteredDebit: "",
  accountedDebit: "",
  enteredCredit: "",
  accountedCredit: "",
  exchangeRate: "1",
  isIDR: true,
  attributeField: null,
  referenceField: null,
  evidence: [],
  ischangeAttribute: false,
  ischangeReference: false,
  attribute1: "",
  attribute2: "",
  attribute3: "",
  attribute4: "",
  attribute5: "",
  attribute6: "",
  attribute7: "",
  attribute8: "",
  attribute9: "",
  attribute10: "",
  reference1: "",
  reference2: "",
  reference3: "",
  reference4: "",
  reference5: "",
  reference6: "",
  reference7: "",
  reference8: "",
  reference9: "",
  reference10: "",
}]

export const DataLineSaveFormat: any = {
  lineNumber: "",
  account: {
    id: "",
    code: "",
    description: ""
  },

  product: {
    id: "",
    code: "",
    name: ""
  },
  project: {
    id: "",
    code: "",
    name: ""
  },
  costCenter: {
    id: "",
    code: "",
    name: ""
  },
  customer: {
    id: "",
    code: "",
    name: ""
  },

  journalEntryType: "",
  currencyCode: "",
  description: "",
  enteredDebit: "",
  accountedDebit: "",
  enteredCredit: "",
  accountedCredit: "",
  exchangeRate: "1",
  evidence: [],
  isIDR: true,
  attribute1: "",
  attribute2: "",
  attribute3: "",
  attribute4: "",
  attribute5: "",
  attribute6: "",
  attribute7: "",
  attribute8: "",
  attribute9: "",
  attribute10: "",
  reference1: "",
  reference2: "",
  reference3: "",
  reference4: "",
  reference5: "",
  reference6: "",
  reference7: "",
  reference8: "",
  reference9: "",
  reference10: "",
}

export const saveFormat: any = {
  headerCode: "",
  journalCategory: "",
  accountingDate: "",
  accountingPeriod: {
    id: "",
    code: "",
  },
  description: "",
  postingState: "",
  organization: {
    id: "",
    code: "",
    name: ""
  },
  product: {
    id: "",
    code: "",
    name: ""
  },
  project: {
    id: "",
    code: "",
    name: ""
  },
  costCenter: {
    id: "",
    code: "",
    name: ""
  },
  customer: {
    id: "",
    code: "",
    name: ""
  },
  journalEntryType: "",
  budgetType: "",
  currencyCode: "",
  exchangedRate: "",
  taxExchangeRate: "",
  actualAccountedDebitAmount: "",
  actualAccountedCreditAmount: "",
  budgetAccountedDebitAmount: "",
  budgetAccountedCreditAmount: "",

  actualEnteredAmount: "",
  budgetEnteredAmount: "",

  totalEvidence: 0,
  lines: DataLineFormat,
  activeFlag: "",
};

export const defaultComboBox = {
  organizations: [],
  products: [],
  projects: [],
  costcenters: [],
  customers: [],
  currencies: [],
  postingstates: [],
  transactioncategorys: [],
  transactionsubcategorys: [],
  accountingperiods: [],
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

export const defaultFilter = {
  ddlOrganization: '',
  dtpAccDateFrom: '',
  dtpAccDateTo: '',
  ddlProduct: '',
  ddlProject: '',
  ddlPosting: '',
  ddlCostCenter: '',
  ddlAccPeriod: '',
  ddlCustomer: '',
  dtpCreatedDateFrom: '',
  dtpCreatedDateTo: '',
  txtDescription: '',
  txtCode: '',
  txtCreatedBy: '',
  txtJournalCategory: '',
};

export const defaultHeader = {
  accountingBookId: "",
  accountingDate: "",
  accountingPeriodCode: "",
  accountingPeriodId: "",
  activeFlag: true,
  actualAccountedCr: "",
  actualAccountedDr: "",
  budgetAccountedCr: "",
  budgetAccountedDr: "",
  budgetType: null,
  companyCode: "",
  companyId: "",
  companyName: "",
  costCenterCode: "",
  costCenterId: "",
  costCenterName: "",
  createdBy: "",
  createdDate: "",
  currencyCode: "IDR",
  customerCode: "SSP",
  customerId: "",
  customerName: "",
  description: "",
  exchangeRate: "1",
  headerCode: "",
  headerId: "",
  journalCategory: "",
  journalEntryType: null,
  lastUpdatedBy: "",
  lastUpdatedDate: "",
  organizationCode: "",
  organizationId: "",
  organizationName: "",
  postingCode: null,
  postingDate: null,
  postingState: "UP",
  productCode: "",
  productId: "",
  productName: "",
  projectCode: "",
  projectId: "",
  projectName: "",
  taxExchangeRate: null,
}
