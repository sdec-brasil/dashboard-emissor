import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import {
  UikFormInputGroup, UikButton, UikInput, UikWidget,
} from '../../@uik';
import { register } from '../../utils/api';

const RegisterPage = withRouter(({ history }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const createUser = () => {
    setLoading(true);
    register({ username, password, name })
      .then(() => {
        setLoading(false);
        history.push('/admin');
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  return (
    <UikWidget style={{ padding: '25%' }}>
      <UikFormInputGroup>
        <UikFormInputGroup direction="horizontal">
          <UikInput
            label="Username"
            placeholder="ana.nota.fiscal"
            onChange={e => setUsername(e.target.value)}
            />
          <UikInput
            label="Nome"
            placeholder="Ana Oliveira"
            onChange={e => setName(e.target.value)} />
          <UikInput
            label="Senha"
            placeholder="aT7n@2Kb"
            type="password"
            onChange={e => setPassword(e.target.value)} />
        </UikFormInputGroup>
        <UikButton primary onClick={createUser} isLoading={loading}>
        Cadastrar-se
        </UikButton>
      </UikFormInputGroup>
    </UikWidget>);
});

export default RegisterPage;
