import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import api from './utils/api';
import { setUser } from './reducers/userState';

import './App.scss';

import store from './store';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './components/LoginPage';
import UserPage from './components/UserPage';
import RegisterPage from './components/RegisterPage';
import './@uik/styles.css';

function App() {
  useEffect(() => {
    const { token, user } = store.getState().userState;
    if (token && !user) {
      api.get('/v1/user').then(({ data }) => {
        store.dispatch(setUser(data));
      });
    }
  }, []);


  return (
    <Provider store={store}>
      <Router>
        <Route exact path="/" component={LoginPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <PrivateRoute path="/admin" Component={UserPage} />
      </Router>
    </Provider>
  );
}

export default App;
