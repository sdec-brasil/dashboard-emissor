import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import Cookies from 'universal-cookie';
import thunkMiddleware from 'redux-thunk';

import RootReducer from '../reducers';
import api from '../utils/api';

const cookies = new Cookies();
const token = cookies.get('token');
api.defaults.headers.common.Authorization = `Bearer ${token}`;

const middleware = applyMiddleware(thunkMiddleware);

const Store = createStore(RootReducer, { userState: { token } }, composeWithDevTools(middleware));

export default Store;
