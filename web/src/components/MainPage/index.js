import React from 'react';
import { useSelector } from 'react-redux';


import UserPage from '../UserPage';
import LoginPage from '../LoginPage';

const MainPage = () => {
  const isAuthenticated = useSelector(state => state.userState.token);

  return (
    <div>
      {isAuthenticated
        ? <UserPage />
        : <LoginPage />}
    </div>

  );
};

export default MainPage;
