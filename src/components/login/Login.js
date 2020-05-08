import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { TextInput } from '../../common/input/TextInput';
import { Button } from '../../common/button/Button';
import { login, clearDataFrom } from './actions';
import { LOGIN_FAIL } from '../../redux/types';
import { encryptPassword } from '../../common/helpers';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errorMsg: '',
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loggedIn !== this.props.loggedIn && this.props.loggedIn === true) {
      this.props.history.push('/menu');
    }

    if (prevProps.dataFrom !== this.props.dataFrom && this.props.dataFrom === LOGIN_FAIL) {
      this.setState({ errorMsg: this.props.errorMsg }, () => { this.props.clearDataFrom(); })
    }
  }

  submitLogin = async () => {
    if (this.state.username.trim().length === 0 || this.state.password.trim().length === 0) {
      this.setState({ errorMsg: 'Username and Password values cannot be empty.' })
    } else {
      let password = await encryptPassword(this.state.password.trim());
      this.props.login(this.state.username.trim(), password);
    }
  }

  onChange = (e) => {
    let field = e.target.id;
    let val = e.target.value;
    this.setState({
      [field]: val
    });
  }

  render() {
    return(
      <div className="modal-bg" onClick={ () => this.props.onClickClose() } style={{ ...this.props.modalBgStyle }}>
        <div
          className={ this.props.modalClass }
          onClick={ (e) => { e.stopPropagation(); } }
          style={{ ...this.props.modalStyle }}
        >
          <div className="modal-title"><h1>Login</h1></div>
          <div className="modal-info">
            <div className="username-container">
              <label htmlFor="username">Username</label>
              <TextInput
                name="username"
                id="username"
                width="200px"
                defaultValue={this.state.username}
                onChange={ (e) => this.onChange(e) }
                autoFocus
                onEnter={ () => this.submitLogin() }
                />
            </div>
            <div className="password-container">
              <label htmlFor="password">Password</label>
              <TextInput
                type="password"
                name="password"
                id="password"
                width="200px"
                defaultValue={this.state.password}
                onChange={ (e) => this.onChange(e) }
                onEnter={ () => this.submitLogin() }
                />
            </div>
          </div>
          <div className="modal-error">{ this.state.errorMsg }</div>
          <div className="modal-buttons">
            <Button
              text="Login"
              backgroundColor="#2ECC71"
              onClick={ () => this.submitLogin() }
            />
            <Button
              text="Close"
              backgroundColor="#D2D2D2"
              onClick={ () => this.props.onClickClose() }
            />
          </div>
        </div>
      </div>
    );
  }
}

Login.defaultProps = {
  modalBgStyle: { },
  modalClass: 'modal-sm',
  modalStyle: { },
  onClickClose: () => { }
}

Login.propTypes = {
  modalBgStyle: PropTypes.object,
  modalClass: PropTypes.string,
  modalStyle: PropTypes.object,
  onClickClose: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.login.loggedIn,
    dataFrom: state.login.dataFrom,
    errorMsg: state.login.errorMsg
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    login,
    clearDataFrom
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
