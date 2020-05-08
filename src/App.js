import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withCookies } from 'react-cookie';

import Register from './components/register/Register';
import Home from './components/home/Home';
import Menu from './components/menu/Menu';
import AddExpectedIncome from './components/income/AddExpectedIncome';
import { Header } from './common/header/Header';
import { logout } from './components/login/actions';
import { GET_PERSIST } from './redux/types';
import LogoLite from './assets/logo_lite.png';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: 0
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loginDataFrom !== this.props.loginDataFrom && this.props.loginDataFrom === GET_PERSIST) {
      this.setState({ opacity: 1 });
    }
  }

  logout = () => {
    this.props.cookies.remove('fitfinance');
    this.props.logout(this.props.userID);
  }

  renderLogout = () => {
    if (this.props.loggedIn) {
      return (
        <Link to="/">
          <div className="logout" onClick={ () => { this.logout(); } }>
            Log Out
          </div>
        </Link>
      )
    }
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Header>
            <div className="app-brand">
              <Link to={ this.props.loggedIn ? "/menu" : "/" }>
                <img className="app-logo" src={LogoLite} alt="FitFinance logo" />
                <div className="app-name">FitFinance</div>
              </Link>
            </div>
            <div className="user-info">
              <div className="user-name">
                { this.props.firstName } { this.props.lastName }
              </div>
              { this.renderLogout() }
            </div>
          </Header>
          <Switch>
            <Route exact path="/" render={ (routeProps) => <Home { ...routeProps } cookies={this.props.cookies} /> } />
            <Route path="/menu" render={ (routeProps) => <Menu { ...routeProps } cookies={this.props.cookies} /> } />
            <Route
              path="/expectedincome"
              render={ (routeProps) => <AddExpectedIncome { ...routeProps } cookies={ this.props.cookies } /> }
            />
            <Route path="/register" component={ Register } />
          </Switch>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    firstName: state.login.firstName,
    lastName: state.login.lastName,
    userID: state.login.userID,
    loggedIn: state.login.loggedIn,
    loginDataFrom: state.login.dataFrom,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    logout
  }, dispatch);
}

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(App));
