import { HttpService } from '../../../utilities';
import  moment  from 'moment';

export const customersByOrganization = (selectedOrganization: any, headers: any) => new Promise(async (resolve, reject) => {
  try {
    const id = selectedOrganization;
    let res = [];
    let listCustomer: object[] = [];
    if (id) {
      res = await HttpService.get(`organizations/${id}/customers`, null, headers);
    }
    else {
      res = await HttpService.get(`customers`, null, headers);
    }

    const result: object[] = [];
    if (res.status === 200 && res.data) {
      res.data.customers.forEach((item: any) => {
        let data = {
          ...item,
          codeName: `${item.code} - ${item.name}`
        }

        result.push(data);
        data = {};
      });
      listCustomer = [...result];
    }

    resolve(listCustomer);
  } catch (e) {
    console.log('error at get request customersByOrganization with error: ', e);
    reject(e);
  }
});

export const projectsByOrganization = (selectedOrganization: any, headers: any) => new Promise(async (resolve, reject) => {
  try {
    const id = selectedOrganization;
    let res = null;
    let listProject: object[] = [];
    if (id) {
      res = await HttpService.get(`organizations/${id}/projects`, null, headers);
    }
    else {
      res = await HttpService.get(`projects`, null, headers);
    }
    const result: object[] = [];
    if (res.status === 200 && res.data) {
      res.data.projects.forEach((item: any) => {
        let data = {
          ...item,
          codeName: `${item.code} - ${item.name}`
        }

        result.push(data);
        data = {};
      });
      listProject = [...result];
    }

    resolve(listProject);
  } catch (e) {
    console.log('error at get request projectsByOrganization with error: ', e);
    reject(e);
  }
});

export const productsByOrganization = (selectedOrganization: any, headers: any) => new Promise(async (resolve, reject) => {
  try {

    let listProduct: object[] = [];
    let res = [];
    if (selectedOrganization) {
      res = await HttpService.get(`organizations/${selectedOrganization}/products`, null, headers);
    }
    else {
      res = await HttpService.get(`products`, null, headers);

    }
    const result: object[] = [];
    if (res.status === 200 && res.data) {
      res.data.products.forEach((item: any) => {
        let data = {
          ...item,
          codeName: `${item.code} - ${item.name}`
        }

        result.push(data);
        data = {};
      });
      listProduct = [...result];
    }
    resolve(listProduct);
  } catch (e) {
    console.log('error at get request method with error: ', e);
    reject(e);
  }
});

export const costCentersByOrganization = (selectedOrganization: any, headers: any) => new Promise(async (resolve, reject) => {
  try {
    const id = selectedOrganization;
    let listCostCenter: object[] = [];
    let res = [];
    if (id) {
      res = await HttpService.get(`organizations/${id}/cost-centers`, null, headers);
    }
    else {
      res = await HttpService.get(`cost-centers`, null, headers);
    }
    const result: object[] = [];
    if (res.status === 200 && res.data) {
      res.data.costCenters.forEach((item: any) => {
        let data = {
          ...item,
          codeName: `${item.code} - ${item.name}`
        }
        result.push(data);
        data = {};
      });
      listCostCenter = [...result];
    }
    resolve(listCostCenter);
  } catch (e) {
    console.log('error at get request costCentersByOrganization with error: ', e);
    reject(e);
  }
});

export const TransCategoriesByOrganization = (selectedOrganization: any, headers: any) => new Promise(async (resolve, reject) => {
  try {
    const id = selectedOrganization;
    let listTransCategories: object[] = [];
    let res = [];
    if (id) {
      res = await HttpService.get(`organizations/${id}/transaction-categories`, null, headers);
    }
    else {
      res = await HttpService.get(`transaction-categories`, null, headers);
    }

    const result: object[] = [];
    if (res.status === 200 && res.data) {
      res.data.transactionCategories.forEach((item: any) => {
        let data = {
          ...item,
          codeName: `${item.code} - ${item.name}`
        }
        result.push(data);
        data = {};
      });
      listTransCategories = [...result];
    }
    resolve(listTransCategories);
  } catch (e) {
    console.log('error at get request TransByOrganization with error: ', e);
    reject(e);
  }
});

export const TransSubCategoriesByOrganization = (selectedOrganization: any, headers: any) => new Promise(async (resolve, reject) => {
  try {
    const id = selectedOrganization;
    let listSubTransCategories: object[] = [];
    let res = [];
    if (id) {
      res = await HttpService.get(`transaction-categories/${id}/sub-categories`, null, headers);
    }
    else {
      res = await HttpService.get(`transaction-categories`, null, headers);
    }

    const result: object[] = [];
    if (res.status === 200 && res.data) {
      res.data.subCategories.forEach((item: any) => {
        let data = {
          ...item,
          codeName: `${item.code} - ${item.name}`
        }
        result.push(data);
        data = {};
      });
      listSubTransCategories = [...result];
    }
    resolve(listSubTransCategories);
  } catch (e) {
    console.log('error at get request TransByOrganization with error: ', e);
    reject(e);
  }
});

export const accounts = (headers: any) => new Promise(async (resolve, reject) => {
  try {
    const res = await HttpService.get(`accounts`, null, headers);
    const listAccount = [{ id: "", code: "", description: "Account" }, ...res.data.account];
    resolve(listAccount);
  } catch (e) {
    console.log('error at get request accounts with error: ', e);
    reject(e);
  }
});

export const accountingPeriods = (headers: any) => new Promise(async (resolve, reject) => {
  try {
    const res = await HttpService.get(`accounting-periods`, null, headers);
    let listAccountingPeriod: object[] = [];
    const result: object[] = [];
    if (res.status === 200 && res.data) {
      res.data.accountingPeriod.forEach((item: any) => {
        let data = {
          ...item,
          codeName: `${item.code} - ${item.name}`
        }
        result.push(data);
        data = {};
      });
      listAccountingPeriod = [...result];
    }
    resolve(listAccountingPeriod);
  } catch (e) {
    console.log('error at get request accountingPeriods with error: ', e);
    reject(e);
  }
});

export const organizations = (headers: any) => new Promise(async (resolve, reject) => {
  try {
    const res = await HttpService.get(`organizations/permission`, null, headers);
    let listOrganization: object[] = [];
    const result: object[] = [];
    if (res.status === 200 && res.data) {
      res.data.organization.forEach((item: any) => {
        let data = {
          ...item,
          codeName: `${item.code} - ${item.name}`
        }
        result.push(data);
        data = {};
      });
      listOrganization = [...result];
    }
    resolve(listOrganization);
  } catch (e) {
    console.log('error at get request accountingPeriods with error: ', e);
    reject(e);
  }
});

export const currencys = (headers: any) => new Promise(async (resolve, reject) => {
  try {
    const res = await HttpService.get('currencies', null, headers);
    const listCurrency = [...res.data.currency];
    resolve(listCurrency);
  } catch (e) {
    console.log('error at get request currencys with error: ', e);
    reject(e);
  }
});

export const changeOrganization = (organizationId: any , combobox: any , token: any) => new Promise(async (resolve, reject) => {
  try {
    const copyCombobox = { ...combobox };
    let copyProductList: any = [];
    let copyProjectList: any = [];
    let copyCostCenterList: any = [];
    let copyCustomerList: any = [];
    let copyTransCategoryList: any = [];
    let copySubTransCategoryList: any = [];
    if (organizationId) {
      copyProductList = await productsByOrganization(organizationId, token);
      copyProjectList = await projectsByOrganization(organizationId, token);
      copyCostCenterList = await costCentersByOrganization(organizationId, token);
      copyCustomerList = await customersByOrganization(organizationId, token);
      copyTransCategoryList = await TransCategoriesByOrganization(organizationId, token);
      copySubTransCategoryList = await TransSubCategoriesByOrganization(organizationId, token);
    }
    copyCombobox.products = [{ id: "", code: "", codeName: "Select Product" }, ...copyProductList];
    copyCombobox.projects = [{ id: "", code: "", codeName: "Select Project" }, ...copyProjectList];
    copyCombobox.costcenters = [{ id: "", code: "", codeName: "Select CostCenter" }, ...copyCostCenterList];
    copyCombobox.customers = [{ id: "", code: "", codeName: "Select Customer" }, ...copyCustomerList];
    copyCombobox.transactioncategorys = [{ id: "", code: "", name: "Select Category" }, ...copyTransCategoryList];
    copyCombobox.transactionsubcategorys = [{ id: "", code: "", name: "Select Sub Category" }, ...copySubTransCategoryList];

    resolve(copyCombobox);
  } catch (e) {
    console.log('error at get request ChangeOrganization with error: ', e);
    reject(e);
  }
});

export const getTransactionCode = (
  headers: any,
) => new Promise(async (resolve, reject) => {
  try {
    const res = await HttpService.get('je-transaction-code', null, headers);
    const transactionCode_: string = res.data.code.code;
    resolve(transactionCode_);
  } catch (e) {
    console.log('error at getTransactionCode with error: ', e);
    reject(e);
  }
});


export const setAccountingPeriod = (accountingPeriods: any) => {
  try {

    const startDate = accountingPeriods.startDate;
    const endDate = accountingPeriods.endDate;

    interface accountingDate {
      startDate: string,
      endDate: string,
    }

    const hasil: accountingDate = {
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD')
    };

    const accountingPeriod = hasil;
    return(accountingPeriod)
  } catch (e) {
    console.log('error at setAccountingPeriod with error: ', e);
  }
};

export const validateSave = (state: any) => {
  const {
    journalCategory,
    accountingPeriodId,
    accountingDate,
    description,
    exchangeRate,
    // listEvidence,
    // dataLine,
  } = state;
  let unFilledField = [];
  let message = '';
  let report = '';
  if (!accountingDate || !exchangeRate || !description
    || !accountingPeriodId || !journalCategory) {
    if (!journalCategory) unFilledField.push('Journal Category');
    if (!accountingPeriodId) unFilledField.push('Accounting Period');
    if (!accountingDate) unFilledField.push('Accounting Date');
    if (!exchangeRate) unFilledField.push('Exchanged Rate');
    if (!description) unFilledField.push('Description');
  }
  
  if (unFilledField.length > 0) {
    unFilledField.forEach((item: string) => {
      message += `${item}, `;
    })

    report = message.slice(0, -2);
  }

  return(report)
};

export const getPager = (totalItems: number, currentPage: number, pageSize: number, direction: string, orderBy: string) => {
  try {
    // default to first page
    currentPage = currentPage || 1;

    // default page size is 10
    pageSize = pageSize || 10;

    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);

    let startPage: number, endPage: number;
    if (totalPages <= 5) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 3 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    const pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages,
      direction: direction,
      orderBy: orderBy
    };
  } catch (e) {
    console.log('error at getPager: ', e);
  }
}

export const getFilterValue = (filter: any) => {
  return {
    headerCode : filter && filter.txtCode ? filter.txtCode : '',
    organizationId : filter && filter.ddlOrganization ? filter.ddlOrganization : '',
    accountingDateFrom : filter && filter.dtpAccDateFrom ? filter.dtpAccDateFrom : '',
    accountingDateTo : filter && filter.dtpAccDateTo ? filter.dtpAccDateTo : '',
    createdDateFrom : filter && filter.dtpCreatedDateFrom ? filter.dtpCreatedDateFrom : '',
    createdDateTo : filter && filter.dtpCreatedDateTo ? filter.dtpCreatedDateTo : '',
    productId : filter && filter.ddlProduct ? filter.ddlProduct : '',
    description : filter && filter.txtDescription ? filter.txtDescription : '',
    projectId : filter && filter.ddlProject ? filter.ddlProject : '',
    postingState : filter && filter.ddlPosting ? filter.ddlPosting : '',
    costCenterId : filter && filter.ddlCostCenter ? filter.ddlCostCenter : '',
    transactionCategoryId : filter && filter.ddlCategory ? filter.ddlCategory : '',
    transactionSubCategoryId : filter && filter.ddlsubCategory ? filter.ddlsubCategory : '',
    customerId : filter && filter.ddlCustomer ? filter.ddlCustomer : '',
    createdBy : filter && filter.txtCreatedBy ? filter.txtCreatedBy : '',
  }
}

export const isDateFromBigger = (dateFrom: any, dateTo: any) => {
  try {
    const DateFrom = new Date(dateFrom);
    const DateTo = new Date(dateTo);
    if (DateFrom > DateTo) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(`error at validate isDateFromBigger with error: ${e}`);
    return false;
  }
}