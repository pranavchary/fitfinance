import {
  INCOME_RETRIEVED,
  INCOME_FAIL,
  SET_EXPECTED_SUCCESS,
  SET_EXPECTED_FAIL,
  CLEAR_INCOME_DATAFROM
} from '../../redux/types';
import { getMonthStartEndDates } from '../../common/helpers';
import { config } from '../../config';

export const getIncome = (userID) => async dispatch => {
  let url = `${ config.backend }/GetIncome`;
  let date = new Date();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let span = getMonthStartEndDates(month, year);
  let options = {
    method: 'POST',
    body: JSON.stringify({ userID, ...span }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
  await fetch(url, options)
  .then(res => res.json())
  .then(response => {
    if (response.error) {
      dispatch({
        type: INCOME_FAIL,
        message: response.message
      });
    } else {
      dispatch({
        type: INCOME_RETRIEVED,
        expected: response.expected,
        recorded: response.recorded
      });
    }
  })
  .catch(err => {
    console.log(err);
  });
}

export const setExpectedIncome = (userID, amount) => async dispatch => {
  let url = `${ config.backend }/SetExpected`;
  let date = new Date();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let options = {
    method: 'POST',
    body: JSON.stringify({ userID, amount, month, year }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
  await fetch(url, options)
  .then(res => res.json())
  .then(response => {
    if (response.error) {
      dispatch({
        type: SET_EXPECTED_FAIL,
        message: response.message
      });
    } else {
      dispatch({
        type: SET_EXPECTED_SUCCESS,
        expected: parseFloat(response)
      });
    }
  })
  .catch(err => {
    console.log(err);
  });
}

export const clearDataFrom = () => async dispatch => {
  dispatch({ type: CLEAR_INCOME_DATAFROM });
}
