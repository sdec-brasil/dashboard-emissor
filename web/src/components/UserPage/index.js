import React from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Cookies from 'universal-cookie';
import store from '../../store';
import { setToken, setUser } from '../../reducers/userState';
import SidePanel from '../SidePanel';
import { UikContainerHorizontal } from '../../@uik';
import './style.scss';
import Empresas from '../EmpresasWidget';
import NotasFiscais from '../NotasFiscaisWidget';
import NotasDePagamento from '../NotasDePagamentoWidget';

const cookies = new Cookies();

const UserPage = withRouter(({ history }) => {
  const selectedWidget = useSelector(state => state.mainState.selectedWidget);
  const logout = () => {
    store.dispatch(setUser(null));
    cookies.remove('token');
    store.dispatch(setToken(null));
    history.push('/');
  };

  let widget = null;

  switch (selectedWidget) {
    case 'empresas': {
      widget = (<Empresas />);
      break;
    }
    case 'notasFiscais': {
      widget = (<NotasFiscais />);
      break;
    }
    case 'notasDePagamento': {
      widget = (<NotasDePagamento />);
      break;
    }
    default: {
      widget = (<Empresas />);
    }
  }

  return (
    <UikContainerHorizontal>
      <SidePanel logout={logout} />
      <div className='admin-content'>
        {widget}
      </div>
    </UikContainerHorizontal>
  );
});

export default UserPage;
