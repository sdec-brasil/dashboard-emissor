import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  UikNavPanel, UikNavSection, UikNavTitle, UikNavSectionTitle, UikNavLink,
} from '../../@uik';

const SidePanel = () => {
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
    </UikNavPanel>
  );
};

export default SidePanel;
