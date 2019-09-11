import React from 'react';
import ListView from '../ListView';
import api from '../../utils/api';
import './style.scss';


const NotasFiscaisWidget = () => {
  const notasFicaisProps = {
    headers: [
      ['address', 'Endereco'],
      ['privateKey', 'Privado'],
      ['publicKey', 'Publico'],
      ['createdAt', 'Criado em', 'date'],
    ],
    endpoint: '/v1/invoices',
    title: 'Notas Fiscais',
    keyField: 'nonce',
    buttonText: 'Nova Nota Fiscal',
    onClickAdd: () => api.post('/v1/invoices').then((response) => {
      console.log(`nova nota registrada ${response.data.address}`);
    }),
  };

  return (
    <ListView {...notasFicaisProps} />
  );
};

export default NotasFiscaisWidget;
