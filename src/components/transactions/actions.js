import {
  TRANSACTIONS_RETRIEVED,
  TRANSACTIONS_FAIL,
  CREATE_TRANS_SUCCESS,
  CREATE_TRANS_FAIL,
  CLEAR_TRANSACTIONS_DATAFROM
} from '../../redux/types';
import { config } from '../../config';
import { getMonthStartEndDates } from '../../common/helpers';

export const getTransactions = (userID) => async dispatch => {
  let url = `${ config.backend }/GetTransactions`;
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
        type: TRANSACTIONS_FAIL,
        message: response.message
      });
    } else {
      dispatch({
        type: TRANSACTIONS_RETRIEVED,
        values: response.transactions,
        types: response.types
      });
    }
  })
  .catch(err => {
    console.log(err);
  });
}

export const createNewTransaction = (budgetID, typeID, amount, date) => async dispatch => {
  let url = `${ config.backend }/NewTransaction`;
  let options = {
    method: 'POST',
    body: JSON.stringify({ budgetID, typeID, amount, date }),
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
        type: CREATE_TRANS_FAIL,
        message: response.message
      });
    } else {
      dispatch({ type: CREATE_TRANS_SUCCESS });
    }
  })
  .catch(err => {
    console.log(err);
  });
}

export const clearDataFrom = () => async dispatch => {
  dispatch({ type: CLEAR_TRANSACTIONS_DATAFROM });
}
