import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import { Action } from '../../../../config/interfaces';
import {
  ACCOUNTENDPOINT,
  ACCOUNTFETCH,
} from '../../config';
import {
  accountSuccess,
  accountFailed,
} from './ActionAccount';
import { HttpService } from '../../../../utilities';

function* workerSagaAccount(params: Action) {
  try {
    const headers = {
      ...params.data.headers,
    };

    const response = yield call(HttpService.get, ACCOUNTENDPOINT, null, headers);

    if (!response.data) throw(response);
    
    if (response.status === 200 && response.data) {
      const result: object[] = [];
      response.data.account.forEach((item: any) => {
        let data = {
          ...item,
          codeName: `${item.code} - ${item.alias}`
        }

        result.push(data);
        data = {};
      });
      yield put(accountSuccess(result));
    } else {
      yield put(accountFailed(response.data.res));
    }
  } catch (error) {
    yield put(accountFailed(error.message));
  }
}

export const watcherSagaAccount = [
  takeLatest(ACCOUNTFETCH, workerSagaAccount),
];
