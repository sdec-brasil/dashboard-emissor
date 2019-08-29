import React from 'react';
import { Provider } from 'react-redux';
import './App.scss';

import Store from './store';
import MainPage from './components/MainPage';
import './@uik/styles.css';


function App() {
  return (
    <Provider store={Store}>
      <MainPage />
    </Provider>
  );
}

export default App;
