import React from 'react';
import SidePanel from '../SidePanel';
import { UikContainerHorizontal, UikWidget } from '../../@uik';

const UserPage = () => {
  const fillHeight = { height: '-webkit-fill-available' };

  return (
    <div>
      <UikContainerHorizontal style={fillHeight}>
        <SidePanel />
        <UikWidget padding>
          <h2>
            This is a widget
          </h2>
        </UikWidget>
      </UikContainerHorizontal>
    </div>
  );
};

export default UserPage;
