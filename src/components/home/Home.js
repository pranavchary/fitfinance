import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Login from '../login/Login';
import { Button } from '../../common/button/Button';
import { resetLogin } from '../login/actions';
import { getPersist } from '../menu/actions';
import { GET_PERSIST } from '../../redux/types';
import { isNullOrUndefined } from '../../common/helpers';

import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoginModal: false,
      opacity: 0
    }
  }

  componentDidMount() {
    let cookie = this.props.cookies.get('fitfinance');
    if (!isNullOrUndefined(cookie)) {
      this.props.getPersist(cookie);
    } else {
      this.setState({ opacity: 1 });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loginDataFrom !== this.props.loginDataFrom && this.props.loginDataFrom === GET_PERSIST) {
      this.props.history.replace('/menu');
    }
  }

  toggleLoginModal = () => {
    this.setState(prevState => ({
      showLoginModal: !prevState.showLoginModal
    }), () => {
      if (this.state.showLoginModal) {
        this.props.resetLogin();
      }
    });
  }

  renderLogin = () => {
    if (this.state.showLoginModal) {
      return <Login history={this.props.history} onClickClose={ () => this.toggleLoginModal() } />
    }
  }

  navigateToRegister = () => {
    this.props.history.push('/register');
  }

  render() {
    return (
      <div className="home" style={{ opacity: this.state.opacity }}>
        { this.renderLogin() }
        <div className="home-nologin">
          <Button onClick={ () => this.toggleLoginModal() } text="Log In" />
          <Button onClick={ () => this.navigateToRegister() } text="Register" />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loginDataFrom: state.login.dataFrom
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    resetLogin,
    getPersist
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
