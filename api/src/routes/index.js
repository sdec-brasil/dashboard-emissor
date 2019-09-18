// App Imports
import transactions from './transactions';
import users from './users';
import companies from './companies';
import settlement from './settlement';
import invoices from './invoices';


const routes = {
  ...transactions,
  ...users,
  ...companies,
  ...settlement,
  ...invoices,
};

export default routes;
