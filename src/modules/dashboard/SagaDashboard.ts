/**
 * @author: dwi.setiyadi@gmail.com
*/

import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import {
  Action,
  NOWPLAYINGENDPOINT,
  NOWPLAYINGFETCH,
} from './ConfigDashboard';
import {
  nowPlayingSuccess,
  nowPlayingFail,
} from './ActionDashboard';
import { HttpService } from '../../utilities';
import { APIUri, APIKey } from './config/ListAPI';

function* workerSagaNowPlaying(params: Action) {
  try {
    const data = {
      ...params.data,
      api_key: APIKey,
    };
    const response = yield call(HttpService.get, APIUri + NOWPLAYINGENDPOINT, data, {});

    if (response.status === 200 && response.data.results.length > 0) {
      yield put(nowPlayingSuccess(response.data.results));
    } else {
      yield put(nowPlayingFail(response.data.status_message));
    }
  } catch (error) {
    yield put(nowPlayingFail(error.message));
  }
}




export const watcherNowPlaying = [
  takeLatest(NOWPLAYINGFETCH, workerSagaNowPlaying),
  // takeLatest(COMBOBOXFETCH, workerSagaGetComboBoxJournalList),
];