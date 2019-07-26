// App Imports
import transactions from './transactions';
import users from './users';
import companies from './companies';
import settlement from './settlement';

const routes = {
  ...transactions,
  ...users,
  ...companies,
  ...settlement,
};

export default routes;
