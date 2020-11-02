import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import { Action } from '../../../../config/interfaces';
import {
  ORGANIZATIONALLENDPOINT,
  ORGANIZATIONALLFETCH,

  ORGANIZATIONBYIDENDPOINT,
  ORGANIZATIONBYIDFETCH,
} from '../../config';
import {
  organizationAllSuccess,
  organizationAllFailed,

  organizationByIdSuccess,
  organizationByIdFailed,
} from './ActionOrganization';
import { HttpService } from '../../../../utilities';

function* workerSagaOrganizationAll(params: Action) {
  try {
    const headers = {
      ...params.data.headers,
    };

    const response = yield call(HttpService.get, ORGANIZATIONALLENDPOINT, null, headers);

    if (!response.data) throw (response);

    if (response.status === 200 && response.data) {
      const result: object[] = [];
      response.data.organization.forEach((item: any) => {
        let data = {
          ...item,
          codeName: `${item.code} - ${item.name}`
        }

        result.push(data);
        data = {};
      });
      yield put(organizationAllSuccess(result));
    } else {
      yield put(organizationAllFailed(response.data.res));
    }
  } catch (error) {
    yield put(organizationAllFailed(error.message));
  }
}

function* workerSagaOrganizationById(params: Action) {
  try {
    const headers = {
      ...params.data.headers,
    };

    const API = ORGANIZATIONBYIDENDPOINT(params.data.id);

    const response = yield call(HttpService.get, API, null, headers);

    if (!response.data) throw (response);

    if (response.status === 200 && response.data) {
      yield put(organizationByIdSuccess(response.data.organization));
    } else {
      yield put(organizationByIdFailed(response.data.res));
    }
  } catch (error) {
    yield put(organizationByIdFailed(error.message));
  }
}

export const watcherSagaOrganization = [
  takeLatest(ORGANIZATIONALLFETCH, workerSagaOrganizationAll),
  takeLatest(ORGANIZATIONBYIDFETCH, workerSagaOrganizationById),
];
