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
import './@uik/styles.css';


function App() {
  useEffect(() => {
    console.log('store: ', store.getState());
    const { token, user } = store.getState().userState;
    if (token && !user) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      api.get('/v1/user').then(({ data }) => {
        store.dispatch(setUser(data));
        console.log('just updated store with user', data);
      });
    }
  });


  return (
    <Provider store={store}>
      <Router>
        {/* <Route path="/" component={MainPage} /> */}
        <Route path="/login" component={LoginPage} />
        {/* <Route path="/dashboard" component={UserPage} /> */}
        <PrivateRoute path="/dashboard" Component={UserPage} />
      </Router>
    </Provider>
  );
}

export default App;
