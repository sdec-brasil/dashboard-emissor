const initialState = {
  selectedWidget: 'empresas',
};

export const setWidget = selectedWidget => ({
  type: 'SET_WIDGET',
  selectedWidget,
});

const mainStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_WIDGET': {
      return { ...state, selectedWidget: action.selectedWidget };
    }

    case 'loggedIn': {
      return { ...state, isAuthenticated: true };
    }

    default: {
      return { ...state };
    }
  }
};

export default mainStateReducer;
