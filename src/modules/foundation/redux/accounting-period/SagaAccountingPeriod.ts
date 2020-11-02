import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import { Action } from '../../../../config/interfaces';
import {
  ACCPERIODALLENDPOINT,
  ACCPERIODALLFETCH,

  ACCPERIODBYSTATEENDPOINT,
  ACCPERIODBYSTATEFETCH,

  ACCPERIODDATEBYSTATEENDPOINT,
  ACCPERIODDATEBYSTATEFETCH,
} from '../../config';
import {
  accPeriodAllSuccess,
  accPeriodAllFailed,

  accPeriodByStateSuccess,
  accPeriodByStateFailed,

  accPeriodDateByStateSuccess,
  accPeriodDateByStateFailed,
} from './ActionAccountingPeriod';
import { HttpService } from '../../../../utilities';

function* workerSagaAccountingPeriodAll(params: Action) {
  try {
    const headers = {
      ...params.data.headers,
    };

    const response = yield call(HttpService.get, ACCPERIODALLENDPOINT, null, headers);

    if (!response.data) throw(response);
    
    if (response.status === 200 && response.data) {
      yield put(accPeriodAllSuccess(response.data.accountingPeriod));
    } else {
      yield put(accPeriodAllFailed(response.data.res));
    }
  } catch (error) {
    yield put(accPeriodAllFailed(error.message));
  }
}

function* workerSagaAccountingPeriodByState(params: Action) {
  try {
    const headers = {
      ...params.data.headers,
    };

    const response = yield call(HttpService.post, ACCPERIODBYSTATEENDPOINT, params.data, headers);

    if (!response.data) throw(response);
    
    if (response.status === 200 && response.data) {
      yield put(accPeriodByStateSuccess(response.data.accountingPeriods));
    } else {
      yield put(accPeriodByStateFailed(response.data.res));
    }
  } catch (error) {
    yield put(accPeriodByStateFailed(error.message));
  }
}

function* workerSagaAccountingPeriodDateByState(params: Action) {
  try {
    const headers = {
      ...params.data.headers,
    };

    const response = yield call(HttpService.post, ACCPERIODDATEBYSTATEENDPOINT, params.data, headers);

    if (!response.data) throw(response);
    
    if (response.status === 200 && response.data) {
      yield put(accPeriodDateByStateSuccess(response.data.datePeriod));
    } else {
      yield put(accPeriodDateByStateFailed(response.data.res));
    }
  } catch (error) {
    yield put(accPeriodDateByStateFailed(error.message));
  }
}

export const watcherSagaAccountingPeriod = [
  takeLatest(ACCPERIODALLFETCH, workerSagaAccountingPeriodAll),
  takeLatest(ACCPERIODBYSTATEFETCH, workerSagaAccountingPeriodByState),
  takeLatest(ACCPERIODDATEBYSTATEFETCH, workerSagaAccountingPeriodDateByState),
];
