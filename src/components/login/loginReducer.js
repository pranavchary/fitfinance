import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  GET_PERSIST,
  CLEAR_LOGIN_DATAFROM,
  RESET_LOGIN,
  RESET
} from '../../redux/types';

const initialState = {
  error: false,
  errorMsg: '',
  loggedIn: false,
  userID: 0,
  firstName: '',
  lastName: '',
  verified: false,
  dataFrom: ''
}

export default (state = initialState, action) => {
  switch(action.type) {
    case REGISTER_SUCCESS:
      return {
        ...state,
        error: false,
        errorMsg: '',
        loggedIn: true,
        userID: action.userID,
        firstName: action.firstName,
        lastName: action.lastName,
        dataFrom: action.type
      }
    case REGISTER_FAIL:
      return {
        ...state,
        error: true,
        errorMsg: action.message,
        loggedIn: false,
        dataFrom: action.type
      }
    case LOGIN_SUCCESS:
    case GET_PERSIST:
      return {
        ...state,
        error: false,
        errorMsg: '',
        loggedIn: true,
        userID: action.userID,
        firstName: action.firstName,
        lastName: action.lastName,
        verified: action.verified,
        dataFrom: action.type
      }
    case LOGIN_FAIL:
      return {
        ...state,
        error: true,
        errorMsg: action.message,
        loggedIn: false,
        dataFrom: action.type
      }
    case CLEAR_LOGIN_DATAFROM:
      return {
        ...state,
        dataFrom: ''
      }
    case RESET_LOGIN:
    case RESET:
      return initialState;
    default:
      return state;
  }
}
