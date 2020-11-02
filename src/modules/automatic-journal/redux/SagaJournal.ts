import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import { Action } from '../../../config/interfaces';
import {
  JournalSuccess,
  JournalFail,
} from './ActionJournal';
import { JOURNALENDPOINT, JOURNALFETCH } from '../config/ConstantsJournal'
//import { HttpService } from '../../../services';
import { HttpService } from '../../../utilities';

function* workerSagaGetJournal(params: Action) {
  try { 
    const response = yield call(HttpService.post, JOURNALENDPOINT, params.data, params.data);
    if (response.status === 200 && response.data) {
      yield put(JournalSuccess(response.data));
    } else {
      yield put(JournalFail(response.data.status_message));
    }
  } catch (error) {
    yield put(JournalFail(error.message));
  }
}


export const watcherSagaJournal = [
  takeLatest(JOURNALFETCH, workerSagaGetJournal),
];
