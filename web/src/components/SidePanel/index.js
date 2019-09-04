import React from 'react';
import { useSelector } from 'react-redux';
import {
  UikNavPanel, UikNavSection, UikNavTitle, UikNavSectionTitle, UikNavLink,
} from '../../@uik';

const SidePanel = (props) => {
  const currentSidePanelPage = useSelector(state => state.mainState.currentSidePanelPage);

  return (
    <UikNavPanel style={{ height: '-webkit-fill-available' }}>
      <UikNavTitle>SDEC Emissor de Notas</UikNavTitle>
      <UikNavSection>
        <UikNavSectionTitle>Menu</UikNavSectionTitle>
        <UikNavLink className={currentSidePanelPage === 'empresas' ? 'active' : ''}> Empresas </UikNavLink>
        <UikNavLink className={currentSidePanelPage === 'notasFiscais' ? 'active' : ''}> Notas Fiscais </UikNavLink>
        <UikNavLink className={currentSidePanelPage === 'notasDePagamentos' ? 'active' : ''}> Notas de Pagamentos </UikNavLink>
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
