import { GET_PERSIST, SET_PERSIST } from '../../redux/types';
import { config } from '../../config';

export const getPersist = (cookie) => async dispatch => {
  let url = `${ config.backend }/GetPersist`;
  let options = {
    method: 'POST',
    body: JSON.stringify({ cookie }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
  await fetch(url, options)
  .then(res => res.json())
  .then(response => {
    if (response.error) {
      console.log(response.message);
    } else {
      dispatch({
        type: GET_PERSIST,
        userID: response.userID,
        firstName: response.firstName,
        lastName: response.lastName,
        verified: response.verified
      });
    }
  });
}

export const setPersist = (cookie, userID) => async dispatch => {
  let url = `${ config.backend }/SetPersist`;
  let options = {
    method: 'POST',
    body: JSON.stringify({ cookie, userID }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
  await fetch(url, options)
  .then(res => res.json())
  .then(response => {
    if (response.error) {
      console.log(response.message);
    } else {
      dispatch({ type: SET_PERSIST });
    }
  });
}
