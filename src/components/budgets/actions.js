import {
  BUDGETS_RETRIEVED,
  BUDGETS_FAIL,
  CREATE_BUDGET_SUCCESS,
  CREATE_BUDGET_FAIL,
  CLEAR_CREATEBUD_DATAFROM
} from '../../redux/types';
import { config } from '../../config';

export const getBudgets = (userID) => async dispatch => {
  let url = `${ config.backend }/GetBudgets`;
  let date = new Date();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let options = {
    method: 'POST',
    body: JSON.stringify({ userID, month, year }),
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
        type: BUDGETS_FAIL,
        message: response.message
      });
    } else {
      dispatch({
        type: BUDGETS_RETRIEVED,
        values: response
      });
    }
  })
  .catch(err => {
    console.log(err);
  });
}

export const createBudget = (categoryID, isVariable, minAmount, maxAmount) => async dispatch => {
  let url = `${config.backend}/CreateBudget`;
  let date = new Date();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let options = {
    method: 'POST',
    body: JSON.stringify({ categoryID, isVariable, minAmount, maxAmount, month, year }),
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
        type: CREATE_BUDGET_FAIL,
        message: response.message
      });
    } else {
      dispatch({ type: CREATE_BUDGET_SUCCESS });
    }
  })
  .catch(err => {
    console.log(err);
  });
}

export const clearDataFrom = () => async dispatch => {
  dispatch({ type: CLEAR_CREATEBUD_DATAFROM });
}
