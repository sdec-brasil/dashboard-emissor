import { param, check, body } from 'express-validator/check';
import models from '../../models';

const validators = {};
validators.postInvoice = [
  body('nonce').not().exists(),
  body('invoiceCode').not().exists(),
  body('substitutes').not().exists(),
  body('substitutedBy').not().exists(),
  body('invoiceName').not().exists(),
  body('status').not().exists(),
  body('encryptedBorrower').isString().optional(),
  body('emitter')
    .custom((value, { req }) => models.address.findByPk(value).then((addr) => {
      if (addr === null) return Promise.reject('Emitter não encontrado no sistema.');
      if (addr.get('userId') !== req.user.id) Promise.reject('Endereço (emitter) não pertence ao usuário logado.');
      models.empresa.findOne({ where: { walletId: addr.get('walletId') } })
        .then((empresa) => {
          if (empresa === null) Promise.reject('enderecoEmissor ainda não foi autorizado por nenhuma empresa.');
        });
    })),

  body('taxNumber').isString(),
  // TODO: some validation required for taxNumber
  body('blockHeight').not().exists(),

  body('provision.issuedOn').isISO8601({ strict: true }),
  body('provision.cityServiceLocation', 'valor invalido').isNumeric()
    .isLength({ min: 7, max: 7 })
    .custom(async (value, { req }) => {
      // TODO: should this be validated?
      // we will need to add model prefeitura to this application
      // const count = await models.prefeitura.count({
      //   where: {
      //     codigoMunicipio: value,
      //   },
      // });
      // if (count === 0) {
      //   throw new Error('prefeitura não encontrada no sistema');
      // }
    }),
  body('provision.serviceCode', 'Deve ser uma string de até 20 caracteres')
    .isString().isLength({ max: 20 }).optional(),
  body('provision.cnaeCode', 'Deve ser uma string de até 20 caracteres')
    .isString().isLength({ max: 20 }).optional(),
  body('provision.nbsCode', 'Deve ser uma string de até 9 caracteres')
    .isString().isLength({ max: 9 }).optional(),
  body('provision.description', 'Deve ser uma string de até 2000 caracteres')
    .isString().isLength({ max: 2000 }),
  body('provision.servicesAmount').isInt(),

  body('tributes.taxBenefit')
    .isBoolean(),
  body('tributes.issExigibility', 'Deve ser um inteiro entre 1 e 7')
    .isInt({ min: 1, max: 7 }),
  body('tributes.processNumber', 'Deve ser uma string de até 30 caracteres')
    .isString().isLength({ max: 30 }).optional(),
  body('tributes.issRate').isNumeric(),
  body('tributes.issAmount').isInt(),
  body('tributes.issWithheld').isBoolean(),
  body('tributes.retentionResponsible')
    .isInt({ min: 1, max: 2 })
    .optional(),
  body('tributes.specialTaxRegime')
    .isInt({ min: 0, max: 16 }).optional(),
  body('tributes.pisAmount').isInt().optional(),
  body('tributes.cofinsAmount').isInt().optional(),
  body('tributes.inssAmount').isInt().optional(),
  body('tributes.irAmount').isInt().optional(),
  body('tributes.csllAmount').isInt().optional(),
  body('tributes.unconditionedDiscountAmount').isInt().optional(),
  body('tributes.conditionedDiscountAmount').isInt().optional(),
  body('tributes.othersAmountsWithheld').isInt().optional(),
  body('tributes.deductionsAmount').isInt().optional(),
  body('tributes.calculationBasis', 'O valor esta incorreto').isInt()
    .custom(async (value, { req }) => {
      const data = req.body;
      let targetValue = parseInt(data.provision.servicesAmount, 10) || 0;
      targetValue -= parseInt(data.tributes.deductionsAmount, 10) || 0;
      targetValue -= parseInt(data.tributes.unconditionedDiscountAmount, 10) || 0;
      if (parseInt(value, 10) !== targetValue) {
        return Promise.reject('A base de calculo está errada.');
      }
    }),
  body('tributes.approximateTax').isInt().optional(),
  body('tributes.netValueNfse')
    .isInt()
    .custom(async (value, { req }) => {
      const data = req.body;
      let targetValue = (parseInt(data.provision.servicesAmount, 10) || 0);
      targetValue -= (parseInt(data.tributes.pisAmount, 10) || 0);
      targetValue -= (parseInt(data.tributes.cofinsAmount, 10) || 0);
      targetValue -= (parseInt(data.tributes.inssAmount, 10) || 0);
      targetValue -= (parseInt(data.tributes.irAmount, 10) || 0);
      targetValue -= (parseInt(data.tributes.csllAmount, 10) || 0);
      targetValue -= (parseInt(data.tributes.othersAmountsWithheld, 10) || 0);
      targetValue -= (parseInt(data.tributes.issAmount, 10) || 0);
      targetValue -= (parseInt(data.tributes.unconditionedDiscountAmount, 10) || 0);
      targetValue -= (parseInt(data.tributes.conditionedDiscountAmount, 10) || 0);
      if (parseInt(value, 10) !== targetValue) {
        return Promise.reject('ValLiquiNfse está incorreto');
      }
    }),
  body('borrower.taxNumber').isString().isLength({ max: 14 }).optional(),
  body('borrower.nif').isString().isLength({ max: 40 }).optional(),
  body('borrower.name')
    .isString().isLength({ max: 150 }).optional(),
  body('borrower.street')
    .isString().isLength({ max: 125 }).optional(),
  body('borrower.number')
    .isString().isLength({ max: 10 })
    .optional(),
  body('borrower.additionalInformation').optional()
    .isString().isLength({ max: 60 })
    .optional(),
  body('borrower.district')
    .isString().isLength({ max: 60 }).optional(),
  body('borrower.city')
    .isInt().optional(),
  body('borrower.state')
    .isString().isLength({ max: 2 }).optional(),
  body('borrower.country')
    .isInt().optional(),
  body('borrower.postalCode')
    .isString().isLength({ max: 8 }).optional(),
  body('borrower.email')
    .isString().isEmail().optional(),
  body('borrower.phoneNumber')
    .isString().isLength({ max: 20 }).optional(),

  body('intermediary.taxNumber')
    .isString().isLength({ max: 14 }).optional(),
  body('intermediary.name')
    .isString().isLength({ max: 150 }).optional(),
  body('intermediary.city')
    .isInt().optional(),
  body('construction.workCode')
    .isString().isLength({ max: 30 }).optional(),
  body('construction.art')
    .isString().isLength({ max: 30 }).optional(),
];

export default validators;
