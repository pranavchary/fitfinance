import {
  CATEGORIES_RETRIEVED,
  CATEGORIES_FAIL,
  ADD_CATEGORY_SUCCESS,
  ADD_CATEGORY_FAIL,
  CLEAR_ADDCAT_DATAFROM,
  RESET_CATEGORIES,
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
    case CATEGORIES_RETRIEVED:
      return {
        ...state,
        error: false,
        errorMsg: '',
        values: action.values,
        dataFrom: action.type
      }
    case CATEGORIES_FAIL:
    case ADD_CATEGORY_FAIL:
      return {
        ...state,
        error: true,
        errorMsg: action.message,
        dataFrom: action.type
      }
    case ADD_CATEGORY_SUCCESS:
      return {
        ...state,
        error: false,
        errorMsg: '',
        dataFrom: action.type
      }
    case CLEAR_ADDCAT_DATAFROM:
      return {
        ...state,
        dataFrom: ''
      }
    case RESET_CATEGORIES:
    case RESET:
      return initialState;
    default:
      return state;
  }
}
