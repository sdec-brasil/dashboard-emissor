import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import api from './utils/api';
import { setUser, setToken } from './reducers/userState';

import './App.scss';

import store from './store';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './components/LoginPage';
import UserPage from './components/UserPage';
import RegisterPage from './components/RegisterPage';
import './@uik/styles.css';

function App() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const { token, user } = store.getState().userState;
    if (token && !user) {
      store.dispatch(setToken(null));
      // test if token is still valid, otherwise logout
      api.get('/v1/user').then(({ data }) => {
        store.dispatch(setToken(token));
        store.dispatch(setUser(data));
        setLoading(false);
      }).catch((err) => {
        store.dispatch(setToken(null));
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);


  return (
    <Provider store={store}>
      {isLoading
        ? (<div>Carregando...</div>)
        : (
          <Router>
            <Route exact path="/" component={LoginPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <PrivateRoute path="/admin" Component={UserPage} />
          </Router>
        )}
    </Provider>
  );
}

export default App;
