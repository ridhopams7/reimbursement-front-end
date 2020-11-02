import { HttpService } from '../../../utilities';

export const Organizations = (permission: any, headers: any) => new Promise(async (resolve, reject) => {
  try {
  
    let listOrganization: object[] = [];
    const res = await HttpService.get(`organizations/permission/${permission}`, null, headers);
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
    console.log('error at get request customersByOrganization with error: ', e);
    reject(e);
  }
})


export const customersByOrganization = (selectedOrganization: any, headers: any) => new Promise(async (resolve, reject) => {
  try {
    const id = selectedOrganization;
    let listCustomer: object[] = [];
    const res = await HttpService.get(`organizations/${id}/customers`, null, headers);
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
})

export const projectsByOrganization = (selectedOrganization: any, headers: any) => new Promise(async (resolve, reject) => {
  try {
    const id = selectedOrganization;
    let listProject: object[] = [];
    if (id) {
      const res = await HttpService.get(`organizations/${id}/projects`, null, headers);
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
    }
    resolve(listProject);
  } catch (e) {
    console.log('error at get request projectsByOrganization with error: ', e);
    reject(e);
  }
})

export const productsByOrganization = (selectedOrganization: any, headers: any) => new Promise(async (resolve, reject) => {
  try {
    const id = selectedOrganization;
    let listProduct: object[] = [];
    if (id) {
      const res = await HttpService.get(`organizations/${id}/products`, null, headers);
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
    }
    resolve(listProduct);
  } catch (e) {
    console.log('error at get request method with error: ', e);
    reject(e);
  }
})

export const costCentersByOrganization = (selectedOrganization: any, headers: any) => new Promise(async (resolve, reject) => {
  try {
    const id = selectedOrganization;
    let listCostCenter: object[] = [];
    const res = await HttpService.get(`organizations/${id}/cost-centers`, null, headers);
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
})

export const accounts = (headers: any) => new Promise(async (resolve, reject) => {
  try {
    const res = await HttpService.get(`accounts`, null, headers);
    const listAccount = [{ id: "", code: "", description: "Account" }, ...res.data.account];
    resolve(listAccount);
  } catch (e) {
    console.log('error at get request accounts with error: ', e);
    reject(e);
  }
})

// export const accountingPeriods = (headers: any) => new Promise(async (resolve, reject) => {
//   try {
//     const res = await HttpService.get(`accounting-periods`, null, headers);
//     const listAccountingPeriod = [{ id: "", code: "", name: "Select Accounting Period" }, ...res.data.accountingPeriod];
//     resolve(listAccountingPeriod);
//   } catch (e) {
//     console.log('error at get request accountingPeriods with error: ', e);
//     reject(e);
//   }
// })

export const currencys = (headers: any) => new Promise(async (resolve, reject) => {
  try {
    const res = await HttpService.get('currencies', null, headers);
    const listCurrency = [...res.data.currency];
    resolve(listCurrency);
  } catch (e) {
    console.log('error at get request currencys with error: ', e);
    reject(e);
  }
})

