import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import { Action } from '../../../../config/interfaces';
import {
  CURRENCYENDPOINT,
  CURRENCYFETCH,
} from '../../config';
import {
  currencySuccess,
  currencyFailed,
} from './ActionCurrency';
import { HttpService } from '../../../../utilities';

function* workerSagaCurrency(params: Action) {
  try {
    const headers = {
      ...params.data.headers,
    };

    const response = yield call(HttpService.get, CURRENCYENDPOINT, null, headers);

    if (!response.data) throw(response);
    
    if (response.status === 200 && response.data) {
      yield put(currencySuccess(response.data.currency));
    } else {
      yield put(currencyFailed(response.data.res));
    }
  } catch (error) {
    yield put(currencyFailed(error.message));
  }
}

export const watcherSagaCurrency = [
  takeLatest(CURRENCYFETCH, workerSagaCurrency),
];
