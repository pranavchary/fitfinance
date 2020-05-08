import { combineReducers } from 'redux';
import login from '../components/login/loginReducer';
import income from '../components/income/incomeReducer';
import categories from '../components/categories/categoriesReducer';
import budgets from '../components/budgets/budgetReducer';
import transactions from '../components/transactions/transactionsReducer';

export default combineReducers({
  login,
  income,
  categories,
  budgets,
  transactions
});
