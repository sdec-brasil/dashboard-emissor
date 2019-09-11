import React from 'react';
import ListView from '../ListView';
import api from '../../utils/api';
import './style.scss';


const EmpresasWidget = () => {
  const companyProps = {
    headers: [
      ['enderecoBlockchain', 'end blockchain'],
      ['razaoSocial', 'razao'],
      ['nomeFantasia', 'nome'],
      ['cnpj', 'cnpj'],
      ['cidadeEndereco', 'cidade'],
      ['email', 'email'],
    ],
    endpoint: '/v1/companies',
    title: 'Empresas',
    keyField: 'enderecoBlockchain',
  };

  const addressProps = {
    headers: [
      ['address', 'Endereco'],
      ['privateKey', 'Privado'],
      ['publicKey', 'Publico', value => value.toUpperCase()],
      ['createdAt', 'Criado em', 'date'],
    ],
    endpoint: '/v1/user/free-addresses',
    title: 'Endereços',
    keyField: 'address',
    buttonText: 'Novo Endereço',
    onClickAdd: () => api.post('/v1/user/new-address').then((response) => {
      console.log(`generated new address ${response.data.address}`);
    }),
  };

  return (
    <>
      <ListView {...companyProps} />
      <ListView {...addressProps} />
    </>
  );
};

export default EmpresasWidget;
