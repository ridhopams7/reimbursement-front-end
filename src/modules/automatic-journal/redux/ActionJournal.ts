import {
  JOURNALFETCH,
  JOURNALSUCCESS,
  JOURNALFAIL,
  JOURNALFILTERVALUE,
} from '../config/ConstantsJournal';

export const JournalFetch = (value: object) => ({ type: JOURNALFETCH, data: value });
export const JournalSuccess = (value: object) => ({ type: JOURNALSUCCESS, data: value });
export const JournalFail = (value: object) => ({ type: JOURNALFAIL, data: value });
export const JournalFilterValue = (value: object) => ({ type: JOURNALFILTERVALUE, data: value });