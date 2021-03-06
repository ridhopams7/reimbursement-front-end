// account
export const ACCOUNTENDPOINT = 'accounts';
export const ACCOUNTFETCH = 'ACCOUNTFETCH';
export const ACCOUNTSUCCESS = 'ACCOUNTSUCCESS';
export const ACCOUNTFAILED = 'ACCOUNTFAILED';

// accounting period all
export const ACCPERIODALLENDPOINT = 'accounting-periods';
export const ACCPERIODALLFETCH = 'ACCPERIODALLFETCH';
export const ACCPERIODALLSUCCESS = 'ACCPERIODALLSUCCESS';
export const ACCPERIODALLFAILED = 'ACCPERIODALLFAILED';

// accounting period by state
export const ACCPERIODBYSTATEENDPOINT = 'accounting-periods/state';
export const ACCPERIODBYSTATEFETCH = 'ACCPERIODBYSTATEFETCH';
export const ACCPERIODBYSTATESUCCESS = 'ACCPERIODBYSTATESUCCESS';
export const ACCPERIODBYSTATEFAILED = 'ACCPERIODBYSTATEFAILED';

// accounting period date by state
export const ACCPERIODDATEBYSTATEENDPOINT = 'accounting-periods/state/start-end-date';
export const ACCPERIODDATEBYSTATEFETCH = 'ACCPERIODDATEBYSTATEFETCH';
export const ACCPERIODDATEBYSTATESUCCESS = 'ACCPERIODDATEBYSTATESUCCESS';
export const ACCPERIODDATEBYSTATEFAILED = 'ACCPERIODDATEBYSTATEFAILED';

// costCenter all
export const COSTCENTERALLENDPOINT = 'cost-centers';
export const COSTCENTERALLFETCH = 'COSTCENTERALLFETCH';
export const COSTCENTERALLSUCCESS = 'COSTCENTERALLSUCCESS';
export const COSTCENTERALLFAILED = 'COSTCENTERALLFAILED';

// costCenter by organization (FK organizationId)
export const COSTCENTERBYORGENDPOINT = (id: string) => `organizations/${id}/cost-centers`;
export const COSTCENTERBYORGFETCH = 'COSTCENTERBYORGFETCH';
export const COSTCENTERBYORGSUCCESS = 'COSTCENTERBYORGSUCCESS';
export const COSTCENTERBYORGFAILED = 'COSTCENTERBYORGFAILED';

// currency
export const CURRENCYENDPOINT = 'currencies';
export const CURRENCYFETCH = 'CURRENCYFETCH';
export const CURRENCYSUCCESS = 'CURRENCYSUCCESS';
export const CURRENCYFAILED = 'CURRENCYFAILED';

// customer all
export const CUSTOMERALLENDPOINT = 'customers';
export const CUSTOMERALLFETCH = 'CUSTOMERALLFETCH';
export const CUSTOMERALLSUCCESS = 'CUSTOMERALLSUCCESS';
export const CUSTOMERALLFAILED = 'CUSTOMERALLFAILED';

// customer (FK organizationId)
export const CUSTOMERBYORGENDPOINT = (id: string) => `organizations/${id}/customers`;
export const CUSTOMERBYORGFETCH = 'CUSTOMERBYORGFETCH';
export const CUSTOMERBYORGSUCCESS = 'CUSTOMERBYORGSUCCESS';
export const CUSTOMERBYORGFAILED = 'CUSTOMERBYORGFAILED';

// organization all (FK companyId)
export const ORGANIZATIONALLENDPOINT = 'organizations';
export const ORGANIZATIONALLFETCH = 'ORGANIZATIONALLFETCH';
export const ORGANIZATIONALLSUCCESS = 'ORGANIZATIONALLSUCCESS';
export const ORGANIZATIONALLFAILED = 'ORGANIZATIONALLFAILED';

// organization by id (FK companyId)
export const ORGANIZATIONBYIDENDPOINT = (id: string) => `organizations/${id}`;
export const ORGANIZATIONBYIDFETCH = 'ORGANIZATIONBYIDFETCH';
export const ORGANIZATIONBYIDSUCCESS = 'ORGANIZATIONBYIDSUCCESS';
export const ORGANIZATIONBYIDFAILED = 'ORGANIZATIONBYIDFAILED';

// product all
export const PRODUCTALLENDPOINT = 'products';
export const PRODUCTALLFETCH = 'PRODUCTALLFETCH';
export const PRODUCTALLSUCCESS = 'PRODUCTALLSUCCESS';
export const PRODUCTALLFAILED = 'PRODUCTALLFAILED';

// product (FK organizationId)
export const PRODUCTBYORGENDPOINT = (id: string) => `organizations/${id}/products`;
export const PRODUCTBYORGFETCH = 'PRODUCTBYORGFETCH';
export const PRODUCTBYORGSUCCESS = 'PRODUCTBYORGSUCCESS';
export const PRODUCTBYORGFAILED = 'PRODUCTBYORGFAILED';

// project all
export const PROJECTALLENDPOINT = 'projects';
export const PROJECTALLFETCH = 'PROJECTALLFETCH';
export const PROJECTALLSUCCESS = 'PROJECTALLSUCCESS';
export const PROJECTALLFAILED = 'PROJECTALLFAILED';

// project (FK organizationId)
export const PROJECTBYORGENDPOINT = (id: string) => `organizations/${id}/projects`;
export const PROJECTBYORGFETCH = 'PROJECTBYORGFETCH';
export const PROJECTBYORGSUCCESS = 'PROJECTBYORGSUCCESS';
export const PROJECTBYORGFAILED = 'PROJECTBYORGFAILED';

// transaction category
export const TRANSCATBYORGENDPOINT = (id: string) => `organizations/${id}/transaction-categories`;
export const TRANSCATBYORGFETCH = 'TRANSCATBYORGFETCH';
export const TRANSCATBYORGSUCCESS = 'TRANSCATBYORGSUCCESS';
export const TRANSCATBYORGFAILED = 'TRANSCATBYORGFAILED';


// account
export const USERROLEENDPOINT = 'user-fnd-roles';
export const USERROLEFETCH = 'USERROLEFETCH';
export const USERROLESUCCESS = 'USERROLESUCCESS';
export const USERROLEFAILED = 'USERROLEFAILED';
