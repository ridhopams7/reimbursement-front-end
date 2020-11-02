/**
 * @author: dwi.setiyadi@gmail.com
*/

import { all } from 'redux-saga/effects';
import { ReduxSaga as LoadSagas } from '../config';

export default function* reduxSaga() {
  yield all(LoadSagas);
}
