import React from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setWidget } from '../../reducers/mainState';
import { EXPLORER_URL } from '../../utils/settings';
import ListView from '../ListView';
import './style.scss';


const NotasFiscaisWidget = withRouter(({ history }) => {
  const dispatch = useDispatch();
  dispatch(setWidget('NotasFicaisWidget'));
  const notasFicaisProps = {
    headers: [
      ['nonce', 'Nonce'],
      ['taxNumber', 'CPF/CNPJ'],
      ['emitter', 'Emissor'],
    ],
    endpoint: `${EXPLORER_URL}/v1/invoices`,
    title: 'Notas Fiscais',
    keyField: 'nonce',
    buttonText: 'Nova Nota Fiscal',
    onClickAdd: () => new Promise((resolve) => {
      history.push('/admin/notas-fiscais/new');
      resolve(true);
    }),
  };

  return (
    <ListView {...notasFicaisProps} />
  );
});

export default NotasFiscaisWidget;
