import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import { Action } from '../../../../config/interfaces';
import {
  COSTCENTERBYORGENDPOINT,
  COSTCENTERBYORGFETCH,

  COSTCENTERALLENDPOINT,
  COSTCENTERALLFETCH,
} from '../../config';
import {
  costCenterByOrgSuccess,
  costCenterByOrgFailed,

  costCenterAllSuccess,
  costCenterAllFailed,
} from './ActionCostCenter';
import { HttpService } from '../../../../utilities';

function* workerSagaCostCenterByOrg(params: Action) {
  try {
    const headers = {
      ...params.data.headers,
    };

    const API = COSTCENTERBYORGENDPOINT(params.data.id);

    const response = yield call(HttpService.get, API, null, headers);

    if (!response.data) throw(response);
    
    if (response.status === 200 && response.data) {
      const result: object[] = [];
      response.data.costCenters.forEach((item: any) => {
        let data = {
          ...item,
          codeName: `${item.code} - ${item.name}`
        }

        result.push(data);
        data = {};
      });
      yield put(costCenterByOrgSuccess(result));
    } else {
      yield put(costCenterByOrgFailed(response.data.res));
    }
  } catch (error) {
    yield put(costCenterByOrgFailed(error.message));
  }
}

function* workerSagaCostCenterAll(params: Action) {
  try {
    const headers = {
      ...params.data.headers,
    };

    const response = yield call(HttpService.get, COSTCENTERALLENDPOINT, null, headers);

    if (!response.data) throw(response);
    
    if (response.status === 200 && response.data) {
      const result: object[] = [];
      response.data.costCenters.forEach((item: any) => {
        let data = {
          ...item,
          codeName: `${item.code} - ${item.name}`
        }

        result.push(data);
        data = {};
      });
      yield put(costCenterAllSuccess(result));
    } else {
      yield put(costCenterAllFailed(response.data.res));
    }
  } catch (error) {
    yield put(costCenterAllFailed(error.message));
  }
}

export const watcherSagaCostCenter = [
  takeLatest(COSTCENTERBYORGFETCH, workerSagaCostCenterByOrg),
  takeLatest(COSTCENTERALLFETCH, workerSagaCostCenterAll),
];
