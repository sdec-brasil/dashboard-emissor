import { combineReducers } from 'redux';
import mainState from './mainState';
import userState from './userState';


const rootReducer = combineReducers({
  mainState,
  userState,
});

export default rootReducer;
