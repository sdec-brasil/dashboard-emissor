import React from 'react';
import { useDispatch } from 'react-redux';
import { UikWidget } from '../../@uik';
import { setWidget } from '../../reducers/mainState';
import './style.scss';


const NotasDePagamentoWidget = () => {
  const dispatch = useDispatch();
  dispatch(setWidget('NotasDePagamentoWidget'));
  return (
    <UikWidget>
    Notas de Pagamento
    </UikWidget>
  );
};

export default NotasDePagamentoWidget;
