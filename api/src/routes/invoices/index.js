import passport from 'passport';
import validators from '../../services/invoices/validators';

export default {
  // Publica uma nota fiscal na Blockchain
  'POST /invoices': {
    path: 'Invoices.post',
    middlewares: [
      passport.authenticate('jwt', { session: false }),
      validators.postInvoice,
    ],
  },


  // Cria uma nova nota fiscal na blockchain que substitui a nota referenciada em txid
  'POST /invoices/:txid': {
    path: 'Invoices.replaceInvoice',
    middlewares: [
      passport.authenticate('jwt', { session: false }),
      validators.postInvoice,
    ],
  },
};
