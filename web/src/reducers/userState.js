import Cookies from 'universal-cookie';

const cookies = new Cookies();


const initialState = {
  user: undefined,
  token: cookies.get('token'),
};

export const setUser = user => ({
  type: 'SET_USER',
  user,
});

export const setToken = token => ({
  type: 'SET_TOKEN',
  token,
});


const userStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER': {
      return { ...state, user: action.user };
    }

    case 'SET_TOKEN': {
      return { ...state, token: action.token };
    }

    default: {
      return { ...state };
    }
  }
};

export default userStateReducer;
