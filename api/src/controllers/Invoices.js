/* eslint-disable class-methods-use-this */
import { validationResult } from 'express-validator/check';
import service from '../services/invoices';


export default class InvoiceController {
  async post(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        const response = await service.postInvoice(req);
        res.status(response.code).send(response.data);
      } catch (err) {
        next(err);
      }
    } else {
      res.status(422).json({ errors: errors.array() });
    }
  }

  async replaceInvoice(req, res, next) {
  // check for validation errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        const response = await service.replaceInvoice(req);
        res.status(response.code).send(response.data);
      } catch (err) {
        next(err);
      }
    } else {
      res.status(422).json({ errors: errors.array() });
    }
  }
}
