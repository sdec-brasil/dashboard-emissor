const initialState = {
  isAuthenticated: false,
};


const mainStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'algo': {
      return { ...state };
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
