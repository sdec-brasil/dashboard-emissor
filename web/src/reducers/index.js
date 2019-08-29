import { combineReducers } from 'redux';

const initialState = {
  isAuthenticated: false,
};

const mainState = (state = initialState, action) => {
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

const rootReducer = combineReducers({
  mainState,
});

export default rootReducer;
