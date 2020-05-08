import {
  TRANSACTIONS_RETRIEVED,
  TRANSACTIONS_FAIL,
  CLEAR_TRANSACTIONS_DATAFROM,
  CREATE_TRANS_SUCCESS,
  CREATE_TRANS_FAIL,
  RESET_TRANSACTIONS,
  RESET
} from '../../redux/types';

const initialState = {
  error: false,
  errorMsg: '',
  currentMonth: [],
  types: [],
  dataFrom: ''
}

export default (state = initialState, action) => {
  switch(action.type) {
    case TRANSACTIONS_RETRIEVED:
      return {
        ...state,
        error: false,
        errorMsg: '',
        currentMonth: action.values,
        types: action.types,
        dataFrom: action.type
      }
    case TRANSACTIONS_FAIL:
    case CREATE_TRANS_FAIL:
      return {
        ...state,
        error: true,
        errorMsg: action.message,
        dataFrom: action.type
      }
    case CREATE_TRANS_SUCCESS:
      return {
        ...state,
        error: false,
        errorMsg: '',
        dataFrom: action.type
      }
    case CLEAR_TRANSACTIONS_DATAFROM:
      return {
        ...state,
        dataFrom: ''
      }
    case RESET_TRANSACTIONS:
    case RESET:
      return initialState;
    default:
      return state;
  }
}
