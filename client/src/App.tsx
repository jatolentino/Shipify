import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Home from './views/home';
import Login from './components/login/index';
import SignUp from './components/signup/index';
import PageNotFound from './views/404';
import { MuiThemeProvider } from '@material-ui/core/styles';
import AddProduct from './components/addProduct';
import theme from './theme';
import CssBaseline from '@material-ui/core/CssBaseline';
import ProductDetails from './components/productDetails';
import Notifications from './components/notifications';
import Favorites from './views/favs';
import UserProfile from './components/user-profile';
import store from './store';
import AppBar from './components/appBar';

interface AppState {
  isOnline: boolean;
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isOnline: store.getState().isLoggedIn,
    };
  }

  componentDidMount() {
    store.subscribe(() => {
      this.setState({
        isOnline: store.getState().isLoggedIn,
      });
    });
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div>
            <AppBar />
            <Route path="/" exact strict component={Home} />
            <Route path="/notifications" exact strict component={Notifications} />
            <Route path="/favs" exact strict component={Favorites} />
            <Route path="/product/:id" component={ProductDetails} />
            <Route path="/error" exact strict render={() => <PageNotFound errorMessage="Invalid page" />} />
            <Route path="/profile/:id" component={UserProfile} />
            <Route
              path="/login"
              exact
              strict
              render={() => {
                return this.state.isOnline ? <Redirect to="/" /> : <Login />;
              }}
            />
            <Route
              path="/signup"
              exact
              strict
              render={() => {
                return this.state.isOnline ? <Redirect to="/" /> : <SignUp />;
              }}
            />
            <Route
              path="/add"
              exact
              strict
              render={() => {
                return !this.state.isOnline ? <Redirect to="/login" /> : <AddProduct />;
              }}
            />
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;