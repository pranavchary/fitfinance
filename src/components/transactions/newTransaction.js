import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { SelectInput } from '../../common/input/SelectInput';
import { TextInput } from '../../common/input/TextInput';
import { Button } from '../../common/button/Button';
import { getMonthStartEndDates, getMonthYear } from '../../common/helpers';
import { getTransactions, createNewTransaction, clearDataFrom } from './actions';
import { CREATE_TRANS_SUCCESS, CREATE_TRANS_FAIL } from '../../redux/types';

class NewTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      budgetID: 0,
      typeID: 0,
      amount: '',
      date: this.dateFormatter(new Date()),
      errorMsg: ''
    }

    this.budgetOptions = [];
    this.typeOptions = [];

    this.props.budgets.forEach(value => {
      let selectOption = {
        value: value.budgetID,
        text: value.categoryName
      };
      this.budgetOptions.push(selectOption);
    });

    this.props.transactions.types.forEach(value => {
      let selectOption = {
        value: value.transactionTypeID,
        text: value.type
      };
      this.typeOptions.push(selectOption);
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.transactions.dataFrom !== this.props.transactions.dataFrom
      && this.props.transactions.dataFrom === CREATE_TRANS_SUCCESS) {
      this.props.getTransactions(this.props.userID);
      this.props.onClickClose();
      this.props.history.push('/menu');
    } else if (prevProps.transactions.dataFrom !== this.props.transactions.dataFrom
      && this.props.transactions.dataFrom === CREATE_TRANS_FAIL) {
        this.setState({
          errorMsg: this.props.transactions.errorMsg
        }, () => { this.props.clearDataFrom(); });
      }
  }

  dateFormatter = (date) => {
    if (isNaN(date.getTime())) {
      date = new Date();
    }
    let yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    if (mm < 10)
      mm = '0' + mm;
    let dd = date.getDate();
    if (dd < 10)
      dd = '0' + dd;
    return `${yyyy}-${mm}-${dd}`;
  }

  createNewTransaction = () => {
    let { budgetID, typeID, amount, date } = this.state;
    if (budgetID === 0 && typeID === 0 && amount === '' && date === '') {
      this.setState({ errorMsg: 'All fields must be filled in with valid inputs.' });
    } else if (budgetID === 0) {
      this.setState({ errorMsg: 'Select a budget to add this transaction to.' });
    } else if (typeID === 0) {
      this.setState({ errorMsg: 'Select a transaction type.' });
    } else if (amount === '') {
      this.setState({ errorMsg: 'Enter an amount for this transaction.' });
    } else if (date === '') {
      this.setState({ errorMsg: 'Choose the date this transaction occurred.' });
    } else {
      this.props.createNewTransaction(budgetID, typeID, amount, date);
    }
  }

  onChange = (e) => {
    let field = e.target.id;
    let val = e.target.value;
    if (field.toLowerCase() === 'amount') {
      val = parseFloat(val);
      if (isNaN(val))
        val = '';
    } else if (field.toLowerCase().includes('id')) {
      val = parseInt(val, 10);
      if (isNaN(val))
        val = 0;
    } else if (field.toLowerCase() === 'date') {
      let chosen = new Date(val);
      let today = new Date();
      let monthspan = getMonthStartEndDates(today.getMonth() + 1, today.getFullYear());
      if (chosen < new Date(monthspan.start) || chosen > new Date(monthspan.end)) {
        val = this.dateFormatter(new Date());
      }
    }
    this.setState({ [field]: val });
  }

  onClose = () => {
    this.setState({
      budgetID: 0,
      typeID: 0,
      amount: 0,
      date: '',
      displayNewTransactionMsg: false,
      errorMsg: ''
    }, () => {
      this.props.onClickClose();
      this.props.history.push('/menu');
    });
  }

  render () {
    return (
      <div className="modal-bg" onClick={ () => this.onClose() } style={{ ...this.props.modalBgStyle }}>
        <div
          className={this.props.modalClass}
          onClick={ (e) => { e.stopPropagation(); } }
          style={{ ...this.props.modalStyle }}
        >
          <div className="modal-title">
            <h1>New Transaction</h1>
            <small>{ getMonthYear() }</small>
          </div>
          <div className="modal-info">
            <div className="modal-input-container">
              <label htmlFor="budgetID">Budget</label>
              <SelectInput
                name="budgetID"
                id="budgetID"
                width="50%"
                onChange={ (e) => this.onChange(e) }
                options={this.budgetOptions}
              />
            </div>
            <div className="modal-input-container">
              <label htmlFor="typeID">Type</label>
              <SelectInput
                name="typeID"
                id="typeID"
                width="50%"
                onChange={ (e) => this.onChange(e) }
                options={this.typeOptions}
              />
            </div>
            <div className="modal-input-container">
              <label htmlFor="amount">Amount</label>
              <TextInput
                type="number"
                name="amount"
                id="amount"
                width="50%"
                defaultValue={this.state.amount}
                onChange = { (e) => this.onChange(e) }
                autoFocus
              />
            </div>
            <div className="modal-input-container">
              <label htmlFor="date">Date</label>
              <TextInput
                type="date"
                name="date"
                id="date"
                width="50%"
                onChange = { (e) => this.onChange(e) }
                defaultValue={this.state.date}
              />
            </div>
          </div>
          <div className="modal-error">{ this.state.errorMsg }</div>
          <div className="modal-buttons">
            <Button
              text="Save"
              backgroundColor="#2ECC71"
              onClick={ () => this.createNewTransaction() }
            />
            <Button
              text="Close"
              backgroundColor="#D2D2D2"
              onClick={ () => this.onClose() }
            />
          </div>
        </div>
      </div>
    )
  }
}

NewTransaction.propTypes = {
  modalBgStyle: PropTypes.object,
  modalStyle: PropTypes.object,
  onClickClose: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    userID: state.login.userID,
    transactions: state.transactions,
    budgets: state.budgets.values
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getTransactions,
    createNewTransaction,
    clearDataFrom
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTransaction);
