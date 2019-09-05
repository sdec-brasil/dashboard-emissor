import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setWidget } from '../../reducers/mainState';
import {
  UikNavPanel, UikNavSection, UikNavTitle, UikNavSectionTitle, UikNavLink,
} from '../../@uik';

const SidePanel = (props) => {
  const dispatch = useDispatch();
  const selectedWidget = useSelector(state => state.mainState.selectedWidget);

  return (
    <UikNavPanel>
      <UikNavTitle>SDEC Emissor de Notas</UikNavTitle>
      <UikNavSection>
        <UikNavSectionTitle>Menu</UikNavSectionTitle>
        <UikNavLink className={selectedWidget === 'empresas' ? 'active' : ''}
          onClick={() => dispatch(setWidget('empresas'))}> Empresas </UikNavLink>
        <UikNavLink className={selectedWidget === 'notasFiscais' ? 'active' : ''}
          onClick={() => dispatch(setWidget('notasFiscais'))}> Notas Fiscais </UikNavLink>
        <UikNavLink className={selectedWidget === 'notasDePagamento' ? 'active' : ''}
          onClick={() => dispatch(setWidget('notasDePagamento'))}> Notas de Pagamentos </UikNavLink>
      </UikNavSection>
      <UikNavSection>
        <UikNavSectionTitle>Suporte</UikNavSectionTitle>
        <UikNavLink>Perguntas Frequentes</UikNavLink>
      </UikNavSection>
      <UikNavSection>
        <UikNavLink onClick={props.logout}>Logout</UikNavLink>
      </UikNavSection>
    </UikNavPanel>
  );
};

export default SidePanel;
