import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import { Action } from '../../../../config/interfaces';
import {
  PRODUCTBYORGENDPOINT,
  PRODUCTBYORGFETCH,

  PRODUCTALLENDPOINT,
  PRODUCTALLFETCH,
} from '../../config';
import {
  productByOrgSuccess,
  productByOrgFailed,

  productAllSuccess,
  productAllFailed,
} from './ActionProduct';
import { HttpService } from '../../../../utilities';

function* workerSagaProductByOrg(params: Action) {
  try {
    const headers = {
      ...params.data.headers,
    };

    const API = PRODUCTBYORGENDPOINT(params.data.id);

    const response = yield call(HttpService.get, API, null, headers);

    if (!response.data) throw (response);

    if (response.status === 200 && response.data) {
      const result: object[] = [];
      response.data.products.forEach((item: any) => {
        let data = {
          ...item,
          codeName: `${item.code} - ${item.name}`
        }

        result.push(data);
        data = {};
      });
      yield put(productByOrgSuccess(result));
    } else {
      yield put(productByOrgFailed(response.data.res));
    }
  } catch (error) {
    yield put(productByOrgFailed(error.message));
  }
}

function* workerSagaProductAll(params: Action) {
  try {
    const headers = {
      ...params.data.headers,
    };

    const response = yield call(HttpService.get, PRODUCTALLENDPOINT, null, headers);

    if (!response.data) throw (response);

    if (response.status === 200 && response.data) {
      const result: object[] = [];
      response.data.products.forEach((item: any) => {
        let data = {
          ...item,
          codeName: `${item.code} - ${item.name}`
        }

        result.push(data);
        data = {};
      });
      yield put(productAllSuccess(result));
    } else {
      yield put(productAllFailed(response.data.res));
    }
  } catch (error) {
    yield put(productAllFailed(error.message));
  }
}

export const watcherSagaProduct = [
  takeLatest(PRODUCTBYORGFETCH, workerSagaProductByOrg),
  takeLatest(PRODUCTALLFETCH, workerSagaProductAll),
];
