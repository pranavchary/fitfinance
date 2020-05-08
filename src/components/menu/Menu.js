import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import AddCategory from '../categories/AddCategory';
import CreateBudget from '../budgets/CreateBudget';
import NewTransaction from '../transactions/newTransaction';
import { DropdownBox } from '../../common/dropdownBox/DropdownBox';
import { TransactionCardSmall } from '../transactions/transactionCardSmall';
import { Button } from '../../common/button/Button';
import { ButtonLink } from '../../common/button/ButtonLink';
import BudgetBar from '../../common/budgetbar/BudgetBar';
import { getIncome } from '../income/actions';
import { getCategories, clearDataFrom as clearCategoriesDataFrom } from '../categories/actions';
import { getBudgets } from '../budgets/actions';
import { getTransactions } from '../transactions/actions';
import { getPersist, setPersist } from './actions';
import {
  isNullOrUndefined,
  encryptPassword,
  amountWithDecimals
} from '../../common/helpers';
import { GET_PERSIST, CATEGORIES_RETRIEVED } from '../../redux/types';

import './Menu.css';

class Menu extends Component {
constructor(props) {
  super(props);
  this.state = {
    opacity: 0,
    showAddCategory: false,
    showCreateBudget: false,
    showNewTransaction: false
  }
}

  async componentDidMount() {
    let cookie = this.props.cookies.get('fitfinance');
    if (this.props.login.userID === 0 && isNullOrUndefined(cookie)) {
      this.props.history.push('/');
    } else if (this.props.login.userID === 0 && !isNullOrUndefined(cookie)) {
        this.props.getPersist(cookie);
    } else if (this.props.login.userID !== 0) {
      this.props.clearCategoriesDataFrom();
      this.props.getIncome(this.props.login.userID);
      this.props.getBudgets(this.props.login.userID);
      this.props.getTransactions(this.props.login.userID);
      this.props.getCategories(this.props.login.userID);
      if (isNullOrUndefined(cookie)) {
        let persist = await encryptPassword(this.props.login.userID);
        this.props.cookies.set('fitfinance', persist, { path: '/' });
        this.props.setPersist(persist, this.props.login.userID);
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.login.dataFrom !== this.props.login.dataFrom && this.props.login.dataFrom === GET_PERSIST) {
      this.props.getIncome(this.props.login.userID);
      this.props.getBudgets(this.props.login.userID);
      this.props.getTransactions(this.props.login.userID);
      this.props.getCategories(this.props.login.userID);
    }
    if (prevProps.categories.dataFrom !== this.props.categories.dataFrom
      && this.props.categories.dataFrom === CATEGORIES_RETRIEVED) {
      this.setState({ opacity: 1 });
    }
  }

  disabledWithVerification = (verified, condition) => {
    if (verified === true && condition === false)
      return false;
    return true;
  }

  toggleNewTransaction = () => {
    this.setState(prevState => ({
      showNewTransaction: !prevState.showNewTransaction
    }));
  }

  renderNewTransaction = () => {
    if (this.state.showNewTransaction) {
      return (
        <NewTransaction
          history={this.props.history}
          onClickClose={ () => this.toggleNewTransaction() }
          modalClass="modal-md"
        />
      )
    }
  }

  toggleAddCategory = () => {
    this.setState(prevState => ({
      showAddCategory: !prevState.showAddCategory
    }));
  }

  renderAddCategory = () => {
    if (this.state.showAddCategory) {
      return <AddCategory history={this.props.history} onClickClose={ () => this.toggleAddCategory() } />
    }
  }

  toggleCreateBudget = () => {
    this.setState(prevState => ({
      showCreateBudget: !prevState.showCreateBudget
    }));
  }

  renderCreateBudget = () => {
    if (this.state.showCreateBudget) {
      return(
        <CreateBudget
          history={ this.props.history }
          onClickClose={ () => this.toggleCreateBudget() }
          modalClass="modal-md"
        />
      )
    }
  }

  renderVerificationMessage = () => {
    if (!this.props.login.verified) {
      return (
        <div className="verification-notice">
          Your account is not yet verified. Please check your email for the verification notice in order to continue using the application.
        </div>
      );
    }
  }

  renderCategories = () => {
    let { categories } = this.props;
    if (categories.error) {
      return (
        <div className="menu-categories-error">
          Unable to retrieve categories: { categories.errorMsg }
        </div>
      );
    } else {
      return (
        <div className="menu-categories">
          <div className="menu-nocategories" style={{ display: categories.values.length === 0 ? "block" : "none" }}>
            { "Looks like you haven't set up any categories yet. Let's get started!" }
          </div>
        </div>
      );
    }
  }

  renderTransactionHistory = () => {
    let { transactions } = this.props;
    let transactionCount = transactions.currentMonth.length
    let transactionHeaderText;
    if (transactionCount > 10) {
      transactionHeaderText = "10 Most Recent Transactions";
    } else if (transactionCount === 0) {
      transactionHeaderText = "No Transaction History"
    } else if (transactionCount === 1) {
      transactionHeaderText = "Most Recent Transaction";
    } else {
      transactionHeaderText = `${transactions.currentMonth.length} Most Recent Transactions`
    }
    if (transactions.error) {
      return (<div></div>);
    } else {
      return (
        <div className="menu-transactions">
          <h3>{ transactionHeaderText }</h3>
          <div className="recent-transactions">
            {
              transactions.currentMonth.map(txn => {
                return (
                  <TransactionCardSmall
                    key={txn.transactionID}
                    categoryName={txn.categoryName}
                    date={ txn.date }
                    amount={amountWithDecimals(txn.amount)}
                    type={txn.type}
                  />
                );
              })
            }
          </div>
        </div>
      )
    }
  }

  calculateBudgetTotal = (budgetID) => {
    let value = 0;
    let recentTxns = this.props.transactions.currentMonth;
    for (let i in recentTxns) {
      if (recentTxns[i].budgetID === budgetID) {
        value += recentTxns[i].amount;
      }
    }

    return value;
  }

  renderBudgets = () => {
    let { budgets, income } = this.props;
    if (budgets.error) {
      return (
        <div className="menu-budgets-error">
          Unable to retrieve budgets: { budgets.errorMsg }
        </div>
      )
    } else {
      return (
        <div className="menu-budgets">
          <h3>Your Budgets</h3>
          <div className="menu-budget-container">
            <div className="menu-nobudgets" style={{ display: budgets.values.length === 0 ? "block" : "none" }}>
              { "You don't have any budgets created for this month yet." }
            </div>
            <div className="menu-nobudgets" style={{ display: income.expected === 0 ? "block": "none" }}>
              { "You won't be able to create any budgets until you record an expected income for this month."}
            </div>
            {
              budgets.values.map(budget => {
                return (
                  <BudgetBar
                    key={budget.budgetID}
                    title={budget.categoryName}
                    maxValue={budget.maxAmount}
                    loadSec={1}
                    myValue={this.calculateBudgetTotal(budget.budgetID)}
                    height={20}
                    budgetHighTextColor="#FAFAFA"
                    showValues
                    background
                    />
                );
              })
            }
          </div>
        </div>
      )
    }
  }

  render() {
    let { verified } = this.props.login;
    let { categories, budgets, income } = this.props;
    return (
      <div className="menu" style={{ opacity: this.state.opacity }}>
        { this.renderAddCategory() }
        { this.renderCreateBudget() }
        { this.renderNewTransaction() }
        <div className="menu-header">
          <h1>Hi, { this.props.login.firstName }!</h1>
          { this.renderVerificationMessage() }
          { this.props.income.expected > 0 ? `Expected Income This Month: $${amountWithDecimals(this.props.income.expected)}` : '' }
        </div>
        <div className="menu-quickactions">
          {
            this.props.income.expected === 0 ?
              <ButtonLink
                text="Expected Income"
                onClick={ () => this.props.history.push('/expectedincome') }
                disabled={this.disabledWithVerification(verified, false)}
              />
            :
              null
          }
          <Button
            text="New Category"
            height="40px"
            width="120px"
            onClick={ () => this.toggleAddCategory() }
            disabled={this.disabledWithVerification(verified, false)}
          />
          <Button
            text="Create Budget"
            height="40px"
            width="120px"
            onClick={ () => this.toggleCreateBudget() }
            disabled={this.disabledWithVerification(verified,
              categories.values.length === 0 || (categories.values.length > 0 && income.expected === 0))
            }
          />
          <Button
            text="Add Transaction"
            height="40px"
            width="120px"
            onClick={ () => this.toggleNewTransaction() }
            disabled={this.disabledWithVerification(verified, budgets.values.length === 0)}
          />
        </div>
        <div className="menu-info">
          <div className="menu-info-row">
            { this.props.categories.values.length === 0 ? this.renderCategories() : this.renderBudgets() }
            { this.renderTransactionHistory() }
          </div>
          <div className="menu-info-row">
            <DropdownBox items={ [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] } width="50%" />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    login: state.login,
    income: state.income,
    categories: state.categories,
    budgets: state.budgets,
    transactions: state.transactions
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getIncome,
    getCategories,
    clearCategoriesDataFrom,
    getBudgets,
    getTransactions,
    getPersist,
    setPersist
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
