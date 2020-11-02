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
    const listAccountingPeriod = [{ id: "", code: "", name: "Select Accounting Period" }, ...res.data.accountingPeriod];
    resolve(listAccountingPeriod);
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

