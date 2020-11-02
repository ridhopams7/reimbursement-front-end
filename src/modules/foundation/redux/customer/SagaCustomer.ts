import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import { Action } from '../../../../config/interfaces';
import {
  CUSTOMERBYORGENDPOINT,
  CUSTOMERBYORGFETCH,

  CUSTOMERALLENDPOINT,
  CUSTOMERALLFETCH,
} from '../../config';
import {
  customerByOrgSuccess,
  customerByOrgFailed,

  customerAllSuccess,
  customerAllFailed,
} from './ActionCustomer';
import { HttpService } from '../../../../utilities';

function* workerSagaCustomerByOrg(params: Action) {
  try {
    const headers = {
      ...params.data.headers,
    };

    const API = CUSTOMERBYORGENDPOINT(params.data.id);

    const response = yield call(HttpService.get, API, null, headers);

    if (!response.data) throw(response);
    
    if (response.status === 200 && response.data) {
      const result: object[] = [];
      response.data.customers.forEach((item: any) => {
        let data = {
          ...item,
          codeName: `${item.code} - ${item.name}`
        }

        result.push(data);
        data = {};
      });
      yield put(customerByOrgSuccess(result));
    } else {
      yield put(customerByOrgFailed(response.data.res));
    }
  } catch (error) {
    yield put(customerByOrgFailed(error.message));
  }
}

function* workerSagaCustomerAll(params: Action) {
  try {
    const headers = {
      ...params.data.headers,
    };

    const response = yield call(HttpService.get, CUSTOMERALLENDPOINT, null, headers);

    if (!response.data) throw(response);
    
    if (response.status === 200 && response.data) {
      const result: object[] = [];
      response.data.customers.forEach((item: any) => {
        let data = {
          ...item,
          codeName: `${item.code} - ${item.name}`
        }

        result.push(data);
        data = {};
      });
      yield put(customerAllSuccess(result));
    } else {
      yield put(customerAllFailed(response.data.res));
    }
  } catch (error) {
    yield put(customerAllFailed(error.message));
  }
}

export const watcherSagaCustomer = [
  takeLatest(CUSTOMERBYORGFETCH, workerSagaCustomerByOrg),
  takeLatest(CUSTOMERALLFETCH, workerSagaCustomerAll),
];
