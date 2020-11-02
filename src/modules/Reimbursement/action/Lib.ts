import { HttpService } from '../../../utilities';
import lodash from 'lodash';
import moment from 'moment';
// function delay() {
//   return new Promise(resolve => setTimeout(resolve, 300));
// }
export const getEvidence = (reimbursementId: any, headers: any) => new Promise(async (resolve, reject) => {
  try {
    // await delay();
    let data = null;
    const res = await HttpService.get(`reimbursement-evidences/${reimbursementId}`, data, headers);

    const rawData = [...res.data.message.evidences];
    const listEvidence: any[] = [];
    rawData.forEach((item: any) => {
      listEvidence.push(item);
    });

    resolve(listEvidence);
  } catch (e) {
    console.log('error at get request currencys with error: ', e);
    reject(e);
  }
})

export const getLoadAttributeReferenceField = (AccountId: string, type: string, listAccount: any) => {
  try {
    // const { dataLine, listAccount } = this.state;
    const response = listAccount.find((obj: any) => obj.id === AccountId);;
    if (response) {
      const keys = Object.keys(response);
      let attributeField: any = [];

      let fieldFormat: any = {
        title: '',
        isMandatory: true,
        type: '',
        length: '',
        name: '',
      };
      if (type === "Attribute") {
        for (const a in keys) {
          const property = keys[a];
          const value = response[property];

          if (property.includes('attribute')) {
            if (property.includes('Name')) {
              if (!value) break;
              fieldFormat.title = value;
              fieldFormat.name = lodash.camelCase(value);
            }

            if (property.includes('IsMandatory')) {
              fieldFormat.isMandatory = value;
            }

            if (property.includes('Type')) {
              fieldFormat.type = value;
            }

            if (property.includes('Length')) {
              fieldFormat.length = value;
              attributeField.push(fieldFormat);
              fieldFormat = {}
            }
          }
        }
      }
      else {
        for (const a in keys) {
          const property = keys[a];
          const value = response[property];

          if (property.includes('reference')) {
            if (property.includes('Name')) {
              if (!value) break;
              fieldFormat.title = value;
              fieldFormat.name = lodash.camelCase(value);
            }

            if (property.includes('IsMandatory')) {
              fieldFormat.isMandatory = value;
            }

            if (property.includes('Type')) {
              fieldFormat.type = value;
            }

            if (property.includes('Length')) {
              fieldFormat.length = value;
              attributeField.push(fieldFormat);
              fieldFormat = {}
            }
          }
        }
      }
      if (attributeField.length > 0) {
        return (attributeField);
      }
      else {
        return (null);
      }
    }
    else {

      return (null);

    }
  } catch (e) {
    console.log('error at getAttributeReferenceField with error: ', e);
  }
}

export const getPostingCode = (accountingPeriodCode: string, headers: any) => new Promise(async (resolve, reject) => {
  try {
    const param: any = {
      accountingPeriodCode,
    };
    const res = await HttpService.get('je-posting-code', { param }, headers);

    let postingCode = "";
    if (res.data.statusCode === 200 && res.data.message) {
      postingCode = res.data.message.code;
    }
    resolve(postingCode);
  } catch (e) {
    console.log('error at getTransactionCode with error: ', e);
    reject(e);
  }
})

export const getTransactionCode = (
  isDuplicate: boolean,
  headers: any,
) => new Promise(async (resolve, reject) => {
  try {
    const res = await HttpService.get('je-transaction-code', null, headers);
    let transactionCode_ = "";
    if (res.data.statusCode === 200 && res.data.message) {
      transactionCode_ = res.data.message.code;
    }
    resolve(transactionCode_);
  } catch (e) {
    console.log('error at getTransactionCode with error: ', e);
    reject(e);
  }
})


export const thousandSeparator = (x: any) => {
  let numb = x;
  if (typeof numb === 'string') numb = Number(numb);
  return numb.toLocaleString('en', { maximumFractionDigits: 4 });

};

export const validateSave = (state: any) => {
  const {
    selectedJournalCategory,
    selectedAccountingPeriod,
    accountingDate,
    description,
    exchangedRate,
    listEvidence,
    dataLine,
  } = state;
  let unFilledField = [];
  let message = '';
  let report = '';
  if (!accountingDate || !exchangedRate || !description
    || !selectedAccountingPeriod || !selectedJournalCategory
    || listEvidence.length <= 0) {
    if (!selectedJournalCategory) unFilledField.push('Journal Category');
    if (!selectedAccountingPeriod) unFilledField.push('Accounting Period');
    if (!accountingDate) unFilledField.push('Accounting Date');
    if (!exchangedRate) unFilledField.push('Exchanged Rate');
    if (!description) unFilledField.push('Description');
    if (listEvidence.length <= 0) unFilledField.push('Evidence');
  }
  if (dataLine.actual.length > 0) {
    dataLine.actual.forEach((item: any, index: number) => {
      const {

        attributeField,
        referenceField,
      } = item;
      if (attributeField) {
        attributeField.forEach((itemAttribute: any, indexAttribute: number) => {
          const data = item[`attribute${indexAttribute + 1}`];
          if (itemAttribute.isMandatory && data === "")
            unFilledField.push(`attribute ${itemAttribute.title} in line number ${index + 1}`);
        });
      }
      if (referenceField) {
        referenceField.forEach((itemReference: any, indexreference: number) => {
          const data = item[`reference${indexreference + 1}`];
          if (itemReference.isMandatory && data === "")
            unFilledField.push(`reference ${itemReference.title} in line number ${index + 1}`);
        });
      }
    })
  }
  else {
    unFilledField.push(`Transaction data line`);
  }
  if (unFilledField.length > 0) {
    unFilledField.forEach((item: string) => {
      message += `${item}, `;
    })

    report = message.slice(0, -2);
  }

  return (report)
};

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
    return (accountingPeriod)
  } catch (e) {
    console.log('error at setAccountingPeriod with error: ', e);
  }
}

export const getattributeReferenceValueIsChange = (type: string, jeLines: any) => {
  try {
    let isChange = false;
    if (jeLines) {
      const copyDataLine = { ...jeLines };
      const keys = Object.keys(copyDataLine);
      for (const a in keys) {
        const property = keys[a];
        if (type === "Attribute") {
          if (property.includes('attribute') &&
            property !== "ischangeAttribute" &&
            property !== "attributeField") {
            if (copyDataLine[property] !== "" && copyDataLine[property] !== null) {
              isChange = true;
              break;
            }
          }
        }
        else {
          if (property.includes('reference') &&
            property !== "ischangeReference" &&
            property !== "referenceField") {
            if (copyDataLine[property] !== "" && copyDataLine[property] !== null) {
              isChange = true;
              break;
            }
          }
        }
      }
    }
    return (isChange);

  } catch (e) {
    console.log('error at getAttributeReferenceField with error: ', e);
  }
}

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
};
export const cekDataApi = (respons: any, masterTypeId: string) => {
  let isValid = true;
  let errormessage = "";
  if (respons.status !== 200) {
    errormessage = respons.data.message;
    isValid = false;
  }

  if (respons.data.statusCode !== 200) {
    errormessage = `Data with id ${masterTypeId} is not exist. Please contact your admin`;
    isValid = false;
  }
  return {
    isValid,
    errormessage,
  };
}
export const getFilterValue = (filter: any) => {
  return {
    headerCode: filter && filter.txtCode ? filter.txtCode : '',
    organizationId: filter && filter.ddlOrganization ? filter.ddlOrganization : '',
    productId: filter && filter.ddlProduct ? filter.ddlProduct : '',
    accountingDateFrom: filter && filter.dtpAccDateFrom ? filter.dtpAccDateFrom : '',
    accountingDateTo: filter && filter.dtpAccDateTo ? filter.dtpAccDateTo : '',
    createdDateFrom: filter && filter.dtpCreatedDateFrom ? filter.dtpCreatedDateFrom : '',
    createdDateTo: filter && filter.dtpCreatedDateTo ? filter.dtpCreatedDateTo : '',
    description: filter && filter.txtDescription ? filter.txtDescription : '',
    projectId: filter && filter.ddlProject ? filter.ddlProject : '',
    postingState: filter && filter.ddlPosting ? filter.ddlPosting : '',
    costCenterId: filter && filter.ddlCostCenter ? filter.ddlCostCenter : '',
    customerId: filter && filter.ddlCustomer ? filter.ddlCustomer : '',
    accountingPeriodId: filter && filter.ddlAccPeriod ? filter.ddlAccPeriod : '',
    createdBy: filter && filter.txtCreatedBy ? filter.txtCreatedBy : '',
    journalCategory: filter && filter.txtJournalCategory ? filter.txtJournalCategory : '',
  }
}

export const messageAction = (res: any, action: string) => {
  let isSucces = true;
  let errorMessage = "";
  const param = {
    type: 'success',
    title: `Data ${action}!`,
    confirmBtnBsStyle: 'success',
    confirmBtnText: 'Ok',
    message: "",
    showCancel: false,
    focusConfirmBtn: false,
  };
  console.log(res.data);
  if (res.data) {
    const message = res.status === 413 ? 'File too large. Total maximum size is 10 MB' : res.data.message;
    if (res.status !== 200) {

      isSucces = false;
      errorMessage = message;
    } else {
      if (res.data.statusCode !== 200) {
        isSucces = false;
        errorMessage = message;
      }
      else {
        param.message = message;
      }

    }
  } else {
    isSucces = false;
    errorMessage = res.message;
  }
  console.log(isSucces);
  if (!isSucces) {
    param.type = 'danger';
    param.title = 'Attention!';
    param.confirmBtnBsStyle = 'primary';
    param.message = errorMessage;
  }
  return {
    isSucces,
    param,
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
};
