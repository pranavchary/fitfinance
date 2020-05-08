import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { TextInput } from '../../common/input/TextInput';
import { Button } from '../../common/button/Button';
import { createUser } from './actions';
import { encryptPassword } from '../../common/helpers';

import './Register.css';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      username: '',
      password: '',
      usernameTip: '',
      validationError: ''
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loggedIn !== this.props.loggedIn && this.props.loggedIn === true) {
      this.props.history.push('/');
    }
  }

  onChange = (e) => {
    let field = e.target.id;
    let val = e.target.value;
    this.setState({
      [field]: val.trim()
    });
  }

  onFocus = (e) => {
    let field = e.target.id;
    if (field === 'username') {
      this.setState({
        usernameTip: 'Username can be a maximum of 20 characters.',
      });
    }
  }

  onBlur = (e) => {
    let field = e.target.id;
    if (field === 'username') {
      this.setState({
        usernameTip: '',
      });
    }
  }

  validateInputs = () => {
    let message = '';
    let { firstname, lastname, email, username, password } = this.state;
    if (firstname.trim().length === 0 || lastname.trim().length === 0
      || email.trim().length === 0 || username.trim().length === 0
      || password.trim().length === 0) {
      message = 'All fields are required. Please enter a value for all fields.'
    } else if (username.trim().length > 20) {
      message = 'Username must be no more than 20 characters.'
    }
    this.setState({ validationError: message });
    return message.length === 0
  }

  createAccount = async () => {
    if (this.validateInputs()) {
      let password = await encryptPassword(this.state.password.trim());
      this.props.createUser(
        this.state.firstname.trim(),
        this.state.lastname.trim(),
        this.state.email.trim(),
        this.state.username.trim(),
        password
      );
    }
  }

  render() {
    return(
      <div className="register">
        <div className="register-title"><h1>Register</h1></div>
        <div className="register-info">
        <div className="firstname-container">
          <label htmlFor="firstname">First Name</label>
          <TextInput
            name="firstname"
            id="firstname"
            width="200px"
            defaultValue={ this.state.firstname }
            onChange={ (e) => this.onChange(e) }
            autoFocus
            onEnter={ () => this.createAccount() }
            />
        </div>
        <div className="lastname-container">
          <label htmlFor="lastname">Last Name</label>
          <TextInput
            name="lastname"
            id="lastname"
            width="200px"
            defaultValue={ this.state.lastname }
            onChange={ (e) => this.onChange(e) }
            onEnter={ () => this.createAccount() }
            />
        </div>
        <div className="email-container">
          <label htmlFor="email">Email Address</label>
          <TextInput
            type="email"
            name="email"
            id="email"
            width="200px"
            defaultValue={ this.state.email }
            onChange={ (e) => this.onChange(e) }
            onEnter={ () => this.createAccount() }
            />
        </div>
          <div className="username-container">
            <label htmlFor="username">Username</label>
            <TextInput
              name="username"
              id="username"
              width="200px"
              defaultValue={ this.state.username }
              onChange={ (e) => this.onChange(e) }
              onFocus={ (e) => this.onFocus(e) }
              onBlur={ (e) => this.onBlur(e) }
              onEnter={ () => this.createAccount() }
              />
              <div className="username-tip">{ this.state.usernameTip }</div>
          </div>
          <div className="password-container">
            <label htmlFor="password">Password</label>
            <TextInput
              type="password"
              name="password"
              id="password"
              width="200px"
              defaultValue={ this.state.password }
              onChange={ (e) => this.onChange(e) }
              onEnter={ () => this.createAccount() }
              />
          </div>
        </div>
        <div className="validation-error">{ this.state.validationError }</div>
        <div className="register-buttons">
        <Button
          text="Create Account"
          width="100px"
          height="50px"
          backgroundColor="#2ECC71"
          onClick={ () => this.createAccount() }
        />
        <Button
          text="Close"
          width="100px"
          height="50px"
          backgroundColor="#D2D2D2"
          onClick={ () => this.props.history.push('/') }
        />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.login.loggedIn
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    createUser
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
