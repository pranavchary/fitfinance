import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { SelectInput } from '../../common/input/SelectInput';
import SwitchInput from '../../common/input/SwitchInput';
import { TextInput } from '../../common/input/TextInput';
import { Button } from '../../common/button/Button';
import { getBudgets, createBudget, clearDataFrom } from './actions';
import { CREATE_BUDGET_SUCCESS, CREATE_BUDGET_FAIL } from '../../redux/types';

class CreateBudget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryID: 0,
      isVariable: false,
      minAmount: '',
      maxAmount: '',
      errorMsg: ''
    }

    this.categoryOptions = [];
    this.props.categories.values.forEach(value => {
      let selectOption = {
        value: value.categoryID,
        text: value.categoryName
      };
      this.categoryOptions.push(selectOption);
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.budgets.dataFrom !== this.props.budgets.dataFrom
      && this.props.budgets.dataFrom === CREATE_BUDGET_SUCCESS) {
      this.props.getBudgets(this.props.userID);
      this.props.onClickClose();
      this.props.history.push('/menu');
    } else if (prevProps.budgets.dataFrom !== this.props.budgets.dataFrom
      && this.props.budgets.dataFrom === CREATE_BUDGET_FAIL) {
        this.setState({
          errorMsg: this.props.budgets.errorMsg
        }, () => { this.props.clearDataFrom(); });
      }
  }

  createBudget = () => {
    if (this.state.categoryID === 0 || this.state.maxAmount === ''
      || this.state.maxAmount <= 0 || (this.state.isVariable === true
        && (this.state.minAmount < 0 || this.state.minAmount === '')
      )
    ) {
        this.setState({ errorMsg: 'All fields must be filled in with valid inputs.' });
      } else {
        this.setState({ errorMsg: '' })
        this.props.createBudget(this.state.categoryID,
          this.state.isVariable,
          this.state.minAmount === '' ? 0 : this.state.minAmount,
          this.state.maxAmount
        );
      }
  }

  onClickSwitch = (e) => {
    this.setState({ isVariable: e.target.value === "on" ? true : false });
  }

  onChange = (e) => {
    let field = e.target.id;
    let val = e.target.value;
    if (field.toLowerCase().includes('amount')) {
      val = parseFloat(val);
      if (isNaN(val))
        val = '';
    } else if (field.toLowerCase().includes('category')) {
      val = parseInt(val, 10);
      if (isNaN(val))
        val = 0;
    }
    this.setState({ [field]: val });
  }

  onClose = () => {
    this.setState({
      categoryID: 0,
      errorMsg: ''
    }, () => {
      this.props.onClickClose();
      this.props.history.push('/menu');
    });
  }

  render() {
    return (
      <div className="modal-bg" onClick={ () => this.onClose() } style={{ ...this.props.modalBgStyle }}>
        <div
          className={this.props.modalClass}
          onClick={ (e) => { e.stopPropagation(); } }
          style={{ ...this.props.modalStyle }}
        >
          <div className="modal-title"><h1>Create Budget</h1></div>
          <div className="modal-info">
            <div className="modal-input-container">
              <label htmlFor="categoryID">Category</label>
              <SelectInput
                name="categoryID"
                id="categoryID"
                width="50%"
                onChange={ (e) => this.onChange(e) }
                options={this.categoryOptions}
              />
            </div>
            <div className="modal-input-container">
              <SwitchInput
                labelText="Variable Amount"
                name="isVariable"
                id="isVariable"
                onClick={ (e) => this.onClickSwitch(e) }
              />
            </div>
            <div
              className={ this.state.isVariable === false ? "modal-input-container hidden" : "modal-input-container" }
            >
              <label htmlFor="minAmount">Min. Amount</label>
              <TextInput
                type="number"
                name="minAmount"
                id="minAmount"
                width="50%"
                defaultValue={this.state.minAmount}
                onChange = { (e) => this.onChange(e) }
              />
            </div>
            <div className="modal-input-container">
              <label htmlFor="maxAmount">{ this.state.isVariable ? "Max. Amount" : "Amount" }</label>
              <TextInput
                type="number"
                name="maxAmount"
                id="maxAmount"
                width="50%"
                defaultValue={this.state.maxAmount}
                onChange = { (e) => this.onChange(e) }
                autoFocus
              />
            </div>
          </div>
          <div className="modal-error">{ this.state.errorMsg }</div>
          <div className="modal-buttons">
            <Button
              text="Save"
              backgroundColor="#2ECC71"
              onClick={ () => this.createBudget() }
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

CreateBudget.defaultProps = {
  modalBgStyle: { },
  modalClass: 'modal-sm',
  modalStyle: { },
  onClickClose: () => { }
}

CreateBudget.propTypes = {
  modalBgStyle: PropTypes.object,
  modalClass: PropTypes.string,
  modalStyle: PropTypes.object,
  onClickClose: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    userID: state.login.userID,
    categories: state.categories,
    budgets: state.budgets
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getBudgets,
    createBudget,
    clearDataFrom
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateBudget);
