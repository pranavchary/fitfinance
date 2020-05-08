import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  RESET,
  CLEAR_LOGIN_DATAFROM,
  RESET_LOGIN
} from '../../redux/types';
import { config } from '../../config';

export const login = (username, password) => async dispatch => {
  let url = `${config.backend}/Login`;
  let options = {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
  await fetch(url, options)
  .then(res => res.json())
  .then(response => {
    console.log(response);
    if (response.error) {
      dispatch({
        type: LOGIN_FAIL,
        message: response.message
      });
    } else {
      dispatch({
        type: LOGIN_SUCCESS,
        userID: response.userID,
        firstName: response.firstName,
        lastName: response.lastName,
        verified: response.verified
      });
    }
  })
  .catch(err => {
    console.log(err);
  });
}

export const logout = (userID) => async dispatch => {
  let url = `${config.backend}/Logout`;
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
    console.log(response);
    if (response.error) {
      console.log(response.error);
    } else {
      dispatch({ type: RESET });
    }
  })
  .catch(err => {
    console.log(err);
  });
}

export const clearDataFrom = () => async dispatch => {
  dispatch({ type: CLEAR_LOGIN_DATAFROM });
}

export const resetLogin = () => async dispatch => {
  dispatch({ type: RESET_LOGIN });
}
