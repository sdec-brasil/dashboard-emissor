import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  UikFormInputGroup, UikButton, UikInput, UikWidget,
  UikContainerHorizontal, UikContainerVertical, UikNavTitle,
} from '../../@uik';

const widgetStyle = {
  margin: 0,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '25px',
};

const LoginPage = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const logIn = (e) => {
    setLoading(true);
    console.log('Fingindo autenticar-se...');
    setTimeout(() => dispatch({ type: 'loggedIn' }), 500);
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
