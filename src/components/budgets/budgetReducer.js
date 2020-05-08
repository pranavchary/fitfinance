import {
  BUDGETS_RETRIEVED,
  BUDGETS_FAIL,
  CREATE_BUDGET_SUCCESS,
  CREATE_BUDGET_FAIL,
  CLEAR_CREATEBUD_DATAFROM,
  RESET_BUDGETS,
  RESET
} from '../../redux/types';

const initialState = {
  error: false,
  errorMsg: '',
  values: [],
  dataFrom: ''
}

export default (state = initialState, action) => {
  switch(action.type) {
    case BUDGETS_RETRIEVED:
      return {
        ...state,
        error: false,
        errorMsg: '',
        values: action.values,
        dataFrom: action.type
      }
    case BUDGETS_FAIL:
    case CREATE_BUDGET_FAIL:
      return {
        ...state,
        error: true,
        errorMsg: action.message,
        dataFrom: action.type
      }
    case CREATE_BUDGET_SUCCESS:
      return {
        ...state,
        error: false,
        errorMsg: '',
        dataFrom: action.type
      }
    case CLEAR_CREATEBUD_DATAFROM:
      return {
        ...state,
        dataFrom: ''
      }
    case RESET_BUDGETS:
    case RESET:
      return initialState;
    default:
      return state;
  }
}
