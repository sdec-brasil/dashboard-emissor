import React from 'react';
import { withRouter } from 'react-router-dom';
import Cookies from 'universal-cookie';
import store from '../../store';
import { setToken, setUser } from '../../reducers/userState';
import SidePanel from '../SidePanel';
import { UikContainerHorizontal, UikContainerVertical } from '../../@uik';
import './style.scss';
import Empresas from '../EmpresasWidget';
import NotasFiscais from '../NotasFiscaisWidget';
import NotasDePagamento from '../NotasDePagamentoWidget';
import AddNotaFiscal from '../AddNotaFiscal';
import PrivateRoute from '../PrivateRoute';

const cookies = new Cookies();

const UserPage = withRouter(({ history, match }) => {
  const logout = () => {
    store.dispatch(setUser(null));
    cookies.remove('token', { path: '/' });
    store.dispatch(setToken(null));
    history.push('/');
  };

  return (
    <UikContainerHorizontal>
      <SidePanel logout={logout} />
      <UikContainerVertical className='admin-content'>
        <PrivateRoute path={`${match.url}/empresas`} Component={Empresas} />
        <PrivateRoute exact path={`${match.url}/notas-fiscais`} Component={NotasFiscais} />
        <PrivateRoute path={`${match.url}/notas-fiscais/new`} Component={AddNotaFiscal} />
        <PrivateRoute path={`${match.url}/notas-de-pagamento`} Component={NotasDePagamento} />
      </UikContainerVertical>

    </UikContainerHorizontal>
  );
});

export default UserPage;
