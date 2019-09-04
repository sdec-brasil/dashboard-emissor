import React, { useState } from 'react';
import {
  UikFormInputGroup, UikButton, UikInput, UikWidget,
} from '../../@uik';
import api from '../../utils/api';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const register = () => {
    setLoading(true);
    api.post('/v1/users', { username, password, name })
      .then((response) => {
        console.log('registered!');
        setLoading(false);
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
            onChange={e => setPassword(e.target.value)} />
        </UikFormInputGroup>
        <UikButton primary onClick={register} isLoading={loading}>
        Cadastrar-se
        </UikButton>
      </UikFormInputGroup>
    </UikWidget>);
};

export default RegisterPage;
