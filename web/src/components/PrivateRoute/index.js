import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ Component, ...rest }) => {
  if (!Component) throw new Error('No component passed to private route');

  const isAuthenticated = useSelector(state => state.userState.token);
  console.log('isAuthenticated', !!isAuthenticated);
  return <Route {...rest} render={
      props => (
        isAuthenticated
          ? <Component {...props} />
          : <Redirect to={{
            pathname: '/login',
            state: { from: props.location },
          }} />
      )} />;
};

export default PrivateRoute;
