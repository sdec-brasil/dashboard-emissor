import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import {
  UikFormInputGroup, UikButton, UikInput, UikWidget,
  UikContainerHorizontal, UikContainerVertical, UikNavTitle,
} from '../../@uik';
import { setToken, setUser } from '../../reducers/userState';
import api from '../../utils/api';
import store from '../../store';


const cookies = new Cookies();

const widgetStyle = {
  margin: 0,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '25px',
};

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const logIn = () => {
    setLoading(true);
    api.post('/login', { username, password })
      .then((response) => {
        // logged in!
        const { token } = response.data;
        store.dispatch(setToken(token));
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        cookies.set('token', token);

        // get user info
        return api.get('/v1/user').then((userInfo) => {
          store.dispatch(setUser(userInfo));
        });
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  return (
    <UikWidget style={widgetStyle}>
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
            <UikButton success>
          Cadastrar-se
            </UikButton>
          </UikContainerVertical>
        </div>
      </UikContainerHorizontal>
    </UikWidget>
  );
};

export default LoginPage;
