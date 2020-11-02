export const JOURNALENDPOINT = 'Journal';
export const JOURNALFETCH = 'JOURNALFETCH';
export const JOURNALREQUEST= 'JOURNALREQUEST';
export const JOURNALSUCCESS = 'JOURNALSUCCESS';
export const JOURNALFAIL = 'JOURNALFAIL';
export const JOURNALCHANGEVALUE = 'JOURNALCHANGEVALUE';
export const JOURNALCHANGEPAGE = 'JOURNALCHANGEPAGE';
export const JOURNALFILTERVALUE = 'JOURNALFILTERVALUE';

export const initialPage = {
  pagenumber: 0,
  direction: "DESC",
  order: 'accountingDate',
  pageSize: 10,
};
export const headersAuth = {
  Authorization: `Bearer `,
};
// export const organization = {
//   organization: {
//     id: "1",
//     code: "10001",
//     name: "Arkademy",
//     type: "tipe1",
//   }
// }
export const organization = {
  organization: {
    id: "1",
    code: "10001",
    name: "Arkademy",
    type: "tipe1",
  }
}

export const transCodeA = {
  code: "123-asj-122-oow"
}

export const transCodeB = {
  code: "123-asj-122-www"
}

export const transactionCategories = {
  transactionCategories: [
    { id: "cat1", name: "CATEGORY - K" },
    { id: "cat2", name: "CATEGORY - L" },
  ]
}

export const subCategories = {
  subCategories: [
    { id: "aabc8fab-00ef-4a9f-ad09-efae6ff265bc", name: "SUBCATEGORY - K" },
    { id: "bbfc7cbe-0f7f-4067-a4c6-034e052a4976", name: "SUBCATEGORY - L" }
  ]
}

export const products = {
  products: [
    { id: "1", code: "code1prod", name: "product 1" },
    { id: "2", code: "code2prod", name: "product 2" },
    { id: "3", code: "code3prod", name: "product 3" },
  ]
}

export const projects = {
  projects: [
    { id: "1", code: "code1proj", name: "project 1" },
    { id: "2", code: "code2proj", name: "project 2" },
    { id: "3", code: "code3proj", name: "project 3" }
  ]
}

export const costCenters = {
  costCenters: [
    { id: "1", code: "code1cost", name: "cost center 1" },
    { id: "2", code: "code2cost", name: "cost center 2" },
    { id: "3", code: "code3cost", name: "cost center 3" },
  ]
}

export const customers = {
  customers: [
    { id: "1", code: "code1cust", name: "customer 1" },
    { id: "2", code: "code2cust", name: "customer 2" },
    { id: "3", code: "code3cust", name: "customer 3" }
  ]
}

export const transactionTypeActualA = {
  transactionTypes: [
    { id: "1", name: "transaction type 1" },
    { id: "2", name: "transaction type 2" }
  ]
}

export const transactionTypeActualB = {
  transactionTypes: [
    { id: "3", name: "transaction type 3" },
    { id: "4", name: "transaction type 4" }
  ]
}

export const transactionParameterA = {
  transactionParameter: {
    transactionCategoryId: "",
    transactionSubCategoryId: "",
    template: "",
    attribute1Title: "Invoice",
    attribute1IsMandatory: "true",
    attribute1Type: "text",
    attribute1Length: "",
    attribute2Title: "InvoiceDueDate",
    attribute2IsMandatory: "true",
    attribute2Type: "date",
    attribute2Length: "",
    attribute3Title: "",
    attribute3IsMandatory: "",
    attribute3Type: "",
    attribute3Length: "",
    attribute4Title: "",
    attribute4IsMandatory: "",
    attribute4Type: "",
    attribute4Length: "",
    attribute5Title: "",
    attribute5IsMandatory: "",
    attribute5Type: "",
    attribute5Length: "",
    attribute6Title: "",
    attribute6IsMandatory: "",
    attribute6Type: "",
    attribute6Length: "",
    attribute7Title: "",
    attribute7IsMandatory: "",
    attribute7Type: "",
    attribute7Length: "",
    attribute8Title: "",
    attribute8IsMandatory: "",
    attribute8Type: "",
    attribute8Length: "",
    attribute9Title: "",
    attribute9IsMandatory: "",
    attribute9Type: "",
    attribute9Length: "",
    attribute10Title: "",
    attribute10IsMandatory: "",
    attribute10Type: "",
    attribute10Length: ""
  }
}

export const transactionParameterB = {
  transactionParameter: {
    transactionCategoryId: "",
    transactionSubCategoryId: "",
    template: "",
    attribute1Title: "",
    attribute1IsMandatory: "",
    attribute1Type: "",
    attribute1Length: "",
    attribute2Title: "",
    attribute2IsMandatory: "",
    attribute2Type: "",
    attribute2Length: "",
    attribute3Title: "",
    attribute3IsMandatory: "",
    attribute3Type: "",
    attribute3Length: "",
    attribute4Title: "",
    attribute4IsMandatory: "",
    attribute4Type: "",
    attribute4Length: "",
    attribute5Title: "",
    attribute5IsMandatory: "",
    attribute5Type: "",
    attribute5Length: "",
    attribute6Title: "",
    attribute6IsMandatory: "",
    attribute6Type: "",
    attribute6Length: "",
    attribute7Title: "",
    attribute7IsMandatory: "",
    attribute7Type: "",
    attribute7Length: "",
    attribute8Title: "",
    attribute8IsMandatory: "",
    attribute8Type: "",
    attribute8Length: "",
    attribute9Title: "",
    attribute9IsMandatory: "",
    attribute9Type: "",
    attribute9Length: "",
    attribute10Title: "",
    attribute10IsMandatory: "",
    attribute10Type: "",
    attribute10Length: ""
  }
}

export const accountingDateRangeTest = {
  startDate: "2019-07-01",
  endDate: "2019-08-29"
}

export const currencyList = [
  { id: '1', name: 'IDR' },
  { id: '2', name: 'USD' },
]

export const saveFormat: any = {
  headerCode: "",
  transactionCategory: {
    id: "",
    name: ""
  },
  transactionSubCategory: {
    id: "",
    name: ""
  },
  accountingDate: "",
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
  actualEnteredAmount: "",
  budgetEnteredAmount: "",
  exchangedRate: "",
  actualAccountedAmount: "",
  budgetAccountedAmount: "",
  isCorrection: false,
  correctionAjCode: "",
  // evidence: [
  //   { fileName: "" },
  // ],
  totalEvidence: 0,
  lines: [
    {
      lineNumber: "",
      transactionType: {
        id: "",
        name: ""
      },
      description: "",
      journalEntryType: "",
      enteredAmount: "",
      accountedAmount: ""
    }
  ],
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
};

export const transactionDetailHeader = {
  headerId: "",
  headerCode: "",
  transactionCategory: {
    id: "",
    name: ""
  },
  transactionSubCategory: {
    id: "",
    name: ""
  },
  accountingPeriod: {
    id: "",
    code: ""
  },
  accountingDate: "",
  description: "",
  postingState: "",
  postingDate: "",
  postingCode: "",
  accountingBookId: "",
  company: {
    id: "",
    code: "",
    name: ""
  },
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
  currencyCode: "",
  actualEnteredAmount: "",
  budgetEnteredAmount: "",
  exchangedRate: "",
  actualAccountedAmount: "",
  budgetAccountedAmount: "",
  isCorrection: false,
  correctionAjCode: "",
  evidence: [
    { fileName: "" },
    { fileName: "" }
  ],
  createdBy: "",
  createdDate: "",
  lastModifiedBy: "",
  lastModifiedDate: "",
  activeFlag: ""
};

export const transactionDetailLines = {
  lines: [
    {
      lineId: "",
      lineNumber: "",
      transactionType: {
        id: "",
        name: ""
      },
      description: "",
      journalEntryType: "",
      enteredAmount: "",
      accountedAmount: ""
    }
  ],
  attribute1: "",
  attribute2: "",
  attribute3: "",
  attribute4: "",
  attribute5: "",
  attribute6: "",
  attribute7: "",
  attribute8: "",
  attribute9: "",
  attribute10: ""
};

export const postingStateList: any = {
  'UP': 'Unposted',
  'PS': 'Posted',
}

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
  ddlCategory: '',
  ddlsubCategory: '',
  ddlCustomer: '',
  dtpCreatedDateFrom: '',
  dtpCreatedDateTo: '',
  txtDescription: '',
  txtCode: '',
  txtCreatedBy: '',
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

export const defaultVoucherList = {
  content: [],
  first: 1,
  last: 0,
  page: 0,
  pageSize: 10,
  totalElements: 0,
};
export const descriptionPostingState = 'Status Post to GL';
export const descriptionAccountingDate = 'Tanggal transaksi';
export const descriptionDescription = 'Deskripsi transaksi';
export const descriptionExchangeRate = 'Nilai tukar mata uang';
export const descriptionEvidence = 'Bukti transaksi';
