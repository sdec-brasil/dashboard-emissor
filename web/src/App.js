import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import api from './utils/api';
import { setUser } from './reducers/userState';
import './App.scss';

import store from './store';
import MainPage from './components/MainPage';
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
      <MainPage />
    </Provider>
  );
}

export default App;
