import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  UikFormInputGroup, UikButton, UikInput, UikWidget,
  UikContainerHorizontal, UikContainerVertical, UikNavTitle,
} from '../../@uik';
import { setToken, setUser } from '../../reducers/userState';
import api from '../../utils/api';
import store from '../../store';

const widgetStyle = {
  margin: 0,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '25px',
};

const login = (username, password) => api.post('/login', { username, password })
  .then((response) => {
    // logged in!
    console.log(`logged in! token is ${response.token}`);
    store.dispatch(setToken(response.token));

    // get user info
    return api.get('/v1/user').then((userInfo) => {
      store.dispatch(setUser(userInfo));
    });
  });

const LoginPage = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const logIn = (e) => {
    setLoading(true);
    api.post('/login', { username, password })
      .then((response) => {
        // console.log(response);
        // logged in!
        store.dispatch(setToken(response.data.token));

        // get user info
        return api.get('/v1/user').then((userInfo) => {
          store.dispatch(setUser(userInfo));
        });
      })
      .catch(error => console.error(error));
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
