import React from 'react';
import ListView from '../ListView';
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
    title: 'Empresa',
    keyField: 'enderecoBlockchain',
    buttonText: 'Nova Empresa',
    onClickAdd: () => console.log('valeu'),
  };

  const addressProps = {
    headers: [
      ['address', 'Endereco'],
      ['privateKey', 'Privado'],
      ['publicKey', 'Publico'],
      ['createdAt', 'Criado em'],
    ],
    endpoint: '/v1/user/free-addresses',
    title: 'Endereços',
    keyField: 'address',
    buttonText: 'Novo Endereço',
    onClickAdd: () => console.log('new address requested'),
  };

  return (
    <>
      <ListView {...companyProps} />
      <ListView {...addressProps} />
    </>
  );
};

export default EmpresasWidget;
