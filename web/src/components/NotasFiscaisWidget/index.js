import React from 'react';
import { withRouter } from 'react-router-dom';
import ListView from '../ListView';
import api from '../../utils/api';
import './style.scss';


const NotasFiscaisWidget = withRouter(({ history }) => {
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
    onClickAdd: () => new Promise((resolve) => {
      history.push('/new-invoice');
      resolve(true);
    }),
  };

  return (
    <ListView {...notasFicaisProps} />
  );
});

export default NotasFiscaisWidget;
