import { REGISTER_FAIL, REGISTER_SUCCESS } from '../../redux/types';
import { config } from '../../config';

export const createUser = (firstName, lastName, emailAddress, username, password) => async dispatch => {
  let url = `${ config.backend }/CreateUser`;
  let options = {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName, emailAddress, username, password }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
  console.log(options.body);
  await fetch(url, options)
  .then(res => res.json())
  .then(response => {
    console.log(response);
    if (response.error) {
      dispatch({
        type: REGISTER_FAIL,
        message: response.message
      });
    } else {
      dispatch({
        type: REGISTER_SUCCESS,
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
