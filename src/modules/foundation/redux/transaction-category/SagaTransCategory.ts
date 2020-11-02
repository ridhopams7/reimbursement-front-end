import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import { Action } from '../../../../config/interfaces';
import {
  TRANSCATBYORGENDPOINT,
  TRANSCATBYORGFETCH,
} from '../../config';
import {
  transCatByOrgSuccess,
  transCatByOrgFailed,
} from './ActionTransCategory';
import { HttpService } from '../../../../utilities';

function* workerSagaTransCatByOrg(params: Action) {
  try {
    const headers = {
      ...params.data.headers,
    };

    const API = TRANSCATBYORGENDPOINT(params.data.id);

    const response = yield call(HttpService.get, API, null, headers);

    if (!response.data) throw (response);

    if (response.status === 200 && response.data) {
      yield put(transCatByOrgSuccess(response.data.transactionCategories));
    } else {
      yield put(transCatByOrgFailed(response.data.res));
    }
  } catch (error) {
    yield put(transCatByOrgFailed(error.message));
  }
}

export const watcherSagaTransCat = [
  takeLatest(TRANSCATBYORGFETCH, workerSagaTransCatByOrg),
];
