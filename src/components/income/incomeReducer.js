import {
  INCOME_RETRIEVED,
  INCOME_FAIL,
  CLEAR_INCOME_DATAFROM,
  SET_EXPECTED_SUCCESS,
  SET_EXPECTED_FAIL,
  ADD_INCOME_SUCCESS,
  ADD_INCOME_FAIL,
  RESET_INCOME,
  RESET
} from '../../redux/types';

const initialState = {
  error: false,
  errorMsg: '',
  expected: 0,
  recorded: [],
  dataFrom: ''
}

export default (state = initialState, action) => {
  switch(action.type) {
    case INCOME_RETRIEVED:
      return {
        ...state,
        error: false,
        errorMsg: '',
        expected: action.expected,
        recorded: action.recorded,
        dataFrom: action.type
      }
    case INCOME_FAIL:
    case SET_EXPECTED_FAIL:
      return {
        ...state,
        error: true,
        errorMsg: action.message,
        dataFrom: action.type
      }
    case ADD_INCOME_SUCCESS:
      return {
        ...state,
        error: false,
        errorMsg: '',
        dataFrom: action.type
      }
    case ADD_INCOME_FAIL:
      return {
        ...state,
        error: true,
        errorMsg: action.message,
        dataFrom: action.type
      }
    case SET_EXPECTED_SUCCESS:
      return {
        ...state,
        expected: action.expected,
        dataFrom: action.type
      }
    case CLEAR_INCOME_DATAFROM:
      return {
        ...state,
        dataFrom: ''
      }
    case RESET_INCOME:
    case RESET:
      return initialState;
    default:
      return state;
  }
}
