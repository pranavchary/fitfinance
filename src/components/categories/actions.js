import {
  CATEGORIES_RETRIEVED,
  CATEGORIES_FAIL,
  ADD_CATEGORY_SUCCESS,
  ADD_CATEGORY_FAIL,
  CLEAR_ADDCAT_DATAFROM
} from '../../redux/types';
import { config } from '../../config';

export const getCategories = (userID) => async dispatch => {
  let url = `${config.backend}/GetCategories`;
  let options = {
    method: 'POST',
    body: JSON.stringify({ userID }),
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
        type: CATEGORIES_FAIL,
        message: response.message
      });
    } else {
      dispatch({
        type: CATEGORIES_RETRIEVED,
        values: response
      });
    }
  })
  .catch(err => {
    console.log(err);
  });
}

export const addCategory = (categoryName, userID) => async dispatch => {
  console.log(categoryName, userID);
  let url = `${config.backend}/AddCategory`;
  let options = {
    method: 'POST',
    body: JSON.stringify({ categoryName, userID }),
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
        type: ADD_CATEGORY_FAIL,
        message: response.message
      });
    } else {
      dispatch({ type: ADD_CATEGORY_SUCCESS });
    }
  })
  .catch(err => {
    console.log(err);
  });
}

export const clearDataFrom = () => async dispatch => {
  dispatch({ type: CLEAR_ADDCAT_DATAFROM });
}
