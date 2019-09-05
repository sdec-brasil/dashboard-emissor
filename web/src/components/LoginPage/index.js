import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, withRouter, Link } from 'react-router-dom';
import {
  UikFormInputGroup, UikButton, UikInput, UikWidget,
  UikContainerHorizontal, UikContainerVertical, UikNavTitle,
} from '../../@uik';
import { login } from '../../utils/api';
import './style.scss';

const LoginPage = withRouter((props) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const { from } = props.location.state || { from: { pathname: '/admin' } };

  const isAuthenticated = useSelector(state => state.userState.token);

  const logIn = () => {
    setLoading(true);
    login({ username, password })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  if (isAuthenticated) return <Redirect to={from} />;

  return (
    <UikWidget className="loginPage">
      <UikContainerHorizontal>
        <div>
          <UikFormInputGroup>
            <UikFormInputGroup direction="horizontal">
              <UikInput
                label="Username"
                placeholder="ana.nota.fiscal"
                type="username"
                onChange={e => setUsername(e.target.value)} />
              <UikInput
                label="Senha"
                type="password"
                onChange={e => setPassword(e.target.value)} />
            </UikFormInputGroup>
            <UikButton primary onClick={logIn} isLoading={loading}>
            Logar
            </UikButton>
          </UikFormInputGroup>
        </div>
        <div style={{ paddingLeft: '15px' }}>
          <UikNavTitle>
          Não tem uma conta?
          </UikNavTitle>
          <UikContainerVertical>
            <UikButton success Component={Link} to="/register">
          Cadastrar-se
            </UikButton>
          </UikContainerVertical>
        </div>
      </UikContainerHorizontal>
    </UikWidget>
  );
});

export default LoginPage;
