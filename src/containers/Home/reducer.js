import moment from 'moment-timezone';
import getTime from 'date-fns/get_time';

import {
  REQUEST_START,
  REQUEST_SUCCESS,
  REQUEST_ERROR,
  TODAY,
  ADD_DAY,
  SUB_DAY,
} from './constants';

const initialState = {
  date: getTime(
    moment
      .tz(Date.now(), 'America/Los_Angeles')
      .startOf('day')
      .format()
  ),
  loading: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case REQUEST_START: {
      return {
        ...state,
        loading: true,
      };
    }
    case REQUEST_SUCCESS: {
      return {
        ...state,
        loading: false,
      };
    }
    case REQUEST_ERROR: {
      return {
        ...state,
        loading: false,
      };
    }
    case TODAY:
    case ADD_DAY:
    case SUB_DAY:
      return {
        ...state,
        date: action.payload.date,
      };
    default:
      return state;
  }
}
