import React from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  UikNavPanel, UikNavSection, UikNavTitle, UikNavSectionTitle, UikNavLink,
} from '../../@uik';

const SidePanel = withRouter((props) => {
  const { history, match } = props;
  const selectedWidget = useSelector(state => state.mainState.selectedWidget);

  const pushTo = (path) => {
    history.push(`${match.path}${path}`);
  };

  return (
    <UikNavPanel>
      <UikNavTitle>SDEC Emissor de Notas</UikNavTitle>
      <UikNavSection>
        <UikNavSectionTitle>Menu</UikNavSectionTitle>
        <UikNavLink className={selectedWidget === 'EmpresasWidget' ? 'active' : ''}
          onClick={() => pushTo('/empresas')}> Empresas </UikNavLink>
        <UikNavLink className={selectedWidget === 'NotasFicaisWidget' ? 'active' : ''}
          onClick={() => pushTo('/notas-fiscais')}> Notas Fiscais </UikNavLink>
        <UikNavLink className={selectedWidget === 'NotasDePagamentoWidget' ? 'active' : ''}
          onClick={() => pushTo('/notas-de-pagamento')}> Notas de Pagamentos </UikNavLink>
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
});

export default SidePanel;
