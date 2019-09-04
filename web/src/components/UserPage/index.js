import React from 'react';
import { withRouter } from 'react-router-dom';
import Cookies from 'universal-cookie';
import store from '../../store';
import { setToken, setUser } from '../../reducers/userState';
import SidePanel from '../SidePanel';
import { UikContainerHorizontal, UikWidget } from '../../@uik';

const cookies = new Cookies();


const UserPage = withRouter(({ history }) => {
  const fillHeight = { height: '-webkit-fill-available' };

  const logout = () => {
    store.dispatch(setUser(null));
    cookies.remove('token');
    store.dispatch(setToken(null));
    history.push('/');
  };

  return (
    <div>
      <UikContainerHorizontal style={fillHeight}>
        <SidePanel logout={logout} />
        <UikWidget padding>
          <h2>
            This is a widget
          </h2>
        </UikWidget>
      </UikContainerHorizontal>
    </div>
  );
});

export default UserPage;
