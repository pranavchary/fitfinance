import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Button } from '../../common/button/Button';
import { TextInput } from '../../common/input/TextInput';
import { getPersist, setPersist } from '../menu/actions';
import { getIncome, setExpectedIncome, clearDataFrom } from './actions';
import { isNullOrUndefined , encryptPassword, getMonthYear } from '../../common/helpers';
import {
  GET_PERSIST,
  INCOME_RETRIEVED,
  SET_EXPECTED_SUCCESS,
  SET_EXPECTED_FAIL
} from '../../redux/types';

import './Income.css';

class AddExpectedIncome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: 0,
      expected: '',
      errorMsg: ''
    }
  }

  async componentDidMount() {
    let cookie = this.props.cookies.get('fitfinance');
    if (this.props.userID === 0 && isNullOrUndefined(cookie)) {
      this.props.history.push('/');
    } else if (this.props.userID === 0 && !isNullOrUndefined(cookie)) {
        this.props.getPersist(cookie);
    } else if (this.props.userID !== 0) {
      this.props.clearDataFrom();
      this.props.getIncome(this.props.userID);
      if (this.props.income.expected > 0) {
        this.props.history.push('/menu');
      }
      if (isNullOrUndefined(cookie)) {
        let persist = await encryptPassword(this.props.userID);
        this.props.cookies.set('fitfinance', persist, { path: '/' });
        this.props.setPersist(persist, this.props.userID);
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loginDataFrom !== this.props.loginDataFrom && this.props.loginDataFrom === GET_PERSIST) {
      this.props.getIncome(this.props.userID);
    }
    if (prevProps.income.dataFrom !== this.props.income.dataFrom && this.props.income.dataFrom === INCOME_RETRIEVED) {
      this.setState({ opacity: 1 });
    }
    if (prevProps.income.dataFrom !== this.props.income.dataFrom && this.props.income.dataFrom === SET_EXPECTED_FAIL) {
      this.setState({ errorMsg: this.props.income.errorMsg });
    }
    if (prevProps.income.dataFrom !== this.props.income.dataFrom
      && this.props.income.dataFrom === SET_EXPECTED_SUCCESS) {
      this.props.history.push('/menu');
    }
  }

  onSubmit = () => {
    if (this.state.expected === '' || this.state.expected === 0) {
      this.setState({ errorMsg: 'A value must be provided for the expected income amount.' })
    } else {
      this.setState({ errorMsg: '' });
      this.props.setExpectedIncome(this.props.userID, this.state.expected);
    }
  }

  onChange = (e) => {
    let field = e.target.id;
    let val = parseFloat(e.target.value);
    if (isNaN(val))
      val = '';
    this.setState({ [field]: val });
  }

  render() {
    return (
      <div className="addincome" style={{ opacity: this.state.opacity }}>
        <div className="addincome-header">
          <h3>Add Expected Income for { getMonthYear() }</h3>
        </div>
        <div className="input-container">
          <label htmlFor="expected">Amount</label>
            <TextInput
              type="number"
              name="expected"
              id="expected"
              width="50%"
              defaultValue={ this.state.expected }
              onChange = { (e) => this.onChange(e) }
              autoFocus
            />
        </div>
        <div className="addincome-error">{ this.state.errorMsg }</div>
        <div className="addincome-buttons">
          <Button
            text="Save"
            onClick={ () => this.onSubmit() }
          />
          <Button
            text="Cancel"
            backgroundColor="#D2D2D2"
            onClick={ () => this.props.history.push('/menu') }
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loginDataFrom: state.login.dataFrom,
    userID: state.login.userID,
    income: state.income
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getPersist,
    setPersist,
    getIncome,
    setExpectedIncome,
    clearDataFrom,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AddExpectedIncome);
