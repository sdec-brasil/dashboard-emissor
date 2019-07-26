import React from 'react';
import {
  UikFormInputGroup, UikButton, UikInput, UikWidget,
} from '../../@uik';

const RegisterPage = () => (
  <UikWidget style={{ padding: '25%' }}>
    <UikFormInputGroup>
      <UikFormInputGroup direction="horizontal">
        <UikInput
          label="Username"
          placeholder="ana.nota.fiscal" />
        <UikInput
          label="Email"
          placeholder="ana@gmail.com" />
        <UikInput
          label="Senha"
          placeholder="aT7n@2Kb" />
      </UikFormInputGroup>
      <UikButton primary>
        Cadastrar-se
      </UikButton>
    </UikFormInputGroup>
  </UikWidget>

);

export default RegisterPage;
