import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import { Action } from '../../../../config/interfaces';
import {
  PROJECTBYORGENDPOINT,
  PROJECTBYORGFETCH,

  PROJECTALLENDPOINT,
  PROJECTALLFETCH,
} from '../../config';
import {
  projectByOrgSuccess,
  projectByOrgFailed,

  projectAllSuccess,
  projectAllFailed,
} from './ActionProject';
import { HttpService } from '../../../../utilities';

function* workerSagaProjectByOrg(params: Action) {
  try {
    const headers = {
      ...params.data.headers,
    };

    const API = PROJECTBYORGENDPOINT(params.data.id);

    const response = yield call(HttpService.get, API, null, headers);

    if (!response.data) throw (response);

    if (response.status === 200 && response.data) {
      const result: object[] = [];
      response.data.projects.forEach((item: any) => {
        let data = {
          ...item,
          codeName: `${item.code} - ${item.name}`
        }

        result.push(data);
        data = {};
      });
      yield put(projectByOrgSuccess(result));
    } else {
      yield put(projectByOrgFailed(response.data.res));
    }
  } catch (error) {
    yield put(projectByOrgFailed(error.message));
  }
}

function* workerSagaProjectAll(params: Action) {
  try {
    const headers = {
      ...params.data.headers,
    };

    const response = yield call(HttpService.get, PROJECTALLENDPOINT, null, headers);

    if (!response.data) throw (response);

    if (response.status === 200 && response.data) {
      const result: object[] = [];
      response.data.projects.forEach((item: any) => {
        let data = {
          ...item,
          codeName: `${item.code} - ${item.name}`
        }

        result.push(data);
        data = {};
      });
      yield put(projectAllSuccess(result));
    } else {
      yield put(projectAllFailed(response.data.res));
    }
  } catch (error) {
    yield put(projectAllFailed(error.message));
  }
}

export const watcherSagaProject = [
  takeLatest(PROJECTBYORGFETCH, workerSagaProjectByOrg),
  takeLatest(PROJECTALLFETCH, workerSagaProjectAll),
];
