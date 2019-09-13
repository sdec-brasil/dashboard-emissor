import ResponseList from '../../utils/response';
import { limitSettings } from '../../config/config';
import models from '../../models';
import { treatNestedFilters, errors, chain } from '../../utils';

const sqs = require('sequelize-querystring');

const listCompanies = async (req) => {
  const sq = sqs.withSymbolicOps(models.Sequelize, {});
  const filter = req.query.filter ? req.query.filter : '';

  // TODO: for this to work, the empresa model needs a key to the block it was registered on
  // if (!filter.includes('block.block_datetime')) {
  //   if (filter.length === 0) {
  //     filter += `block.block_datetime lte ${((new Date()).toISOString())}`;
  //   } else {
  //     filter += `, block.block_datetime lte ${((new Date()).toISOString())}`;
  //   }
  // }
  let where = null;
  try {
    where = sq.find(filter);
  } catch (err) {
    throw new errors.BadFilterError();
  }
  treatNestedFilters(filter, where);

  return models.empresa.findAndCountAll({
    offset: parseInt(req.query.offset, 10) || 0,
    limit: parseInt(req.query.limit, 10) || limitSettings.invoice.get,
    where,
    order: req.query.sort ? sq.sort(req.query.sort) : [],
  }).then((results) => {
    const response = new ResponseList(req, results, filter);
    return { code: 200, data: response.value() };
  }).catch((err) => {
    throw err;
  });
};

const getCompany = async req =>
  // search by cnpj
  models.empresa.findByPk(req.params.id)
    .then((companyByTaxNumber) => {
      if (companyByTaxNumber) {
        return { code: 200, data: companyByTaxNumber };
      }
      // search by public address
      return models.empresa.findOne({
        where: { endBlock: req.params.id },
      })
        .then((companyByAddress) => {
          if (companyByAddress) {
            return { code: 200, data: companyByAddress };
          }
          throw new errors.NotFoundError('Company', `taxNumber or endBlock ${req.params.id}`);
        });
    });


const postCompany = async (req) => {
  // chain.registerEnterprise(companyInfo);
  await models.empresa.create({
    ...req.body,
    endBlock: req.body.endBlock,
    user_id: req.body.user_id,
  });
  return { code: 201, data: 'created' };
};


export default {
  listCompanies,
  getCompany,
  postCompany,
};
