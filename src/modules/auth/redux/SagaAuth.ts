import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import { Action } from '../../../config/interfaces';
import { USERLOGINFETCH } from '../config';
import { UserAPI } from '../config';
import {
  userLoginSuccess,
  userLoginFailed,
} from './ActionAuth';
import { HttpService } from '../../../utilities';

function* workerSagaLogin(params: Action) {
  try {
    const data: object = {
      username: params.data.username,
    };
    const headers: object = {
      information: params.data.password,
    };
    const response = yield call(HttpService.post, UserAPI.login.api, data, headers);

    if (!response.data) throw(response);
    console.log(response);
    if (response.data.statusCode === 200 && response.data.message && response.headers.content) {
      const parseResponse = {
        ...response.data.message,
        token: response.headers.content,
        token_expired: response.headers.exp,
      };
      
      yield put(userLoginSuccess(parseResponse));
    } else {
      yield put(userLoginFailed(response.data.message));
    }
  } catch (error) {
    yield put(userLoginFailed(error.message));
  }
}

export const watcherSagaLogin = [
  takeLatest(USERLOGINFETCH, workerSagaLogin),
];
