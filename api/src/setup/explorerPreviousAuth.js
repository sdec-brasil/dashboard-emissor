import axios from 'axios';
import models from '../models';

const { Op } = models.Sequelize;

const getFreeWallets = (limit = undefined, time) => models.address.findAll({
  include: [
    {
      model: models.wallet,
      attributes: [],
      where: {
        userWallet: true,
      },
    },
  ],
  attributes: ['address'],
  where: {
    createdAt: { [Op.lte]: time },
  },
  limit,
  raw: true,
});

const processItem = (companyInfo, address) => new Promise(async (resolve) => {
  const addr = await models.address.findByPk(address);
  const user = await models.user.findOne({
    where: {
      walletId: addr.get('walletId'),
    },
  });

  let company = await models.empresa.findByPk(companyInfo.endBlock);
  if (!company) {
    company = await models.empresa.create({
      ...companyInfo,
      user_id: user.get('id'),
    });
  }
  await addr.update({ walletId: company.get('walletId') });
  resolve(true);
});


export default async function () {
  console.log('SETUP - Querying explorer for previous authorizations...');
  const explorerUrl = process.env.EXPLORER_URL || 'http://159.89.86.197:8000';
  let count = 0;
  const now = new Date();
  const freeAddresses = await getFreeWallets(undefined, now);
  if (freeAddresses.length) {
    const promises = freeAddresses.map(item => new Promise(async (resolve) => {
      let response;
      // getting emitter info, including companies
      try {
        response = await axios.get(`${explorerUrl}/v1/emitters/${item.address}`);
      } catch (err) {
        console.log(`Free address ${item.address} not registered yet.`);
        resolve(true);
        return;
      }
      const companies = response.data.Empresas;

      if (companies.length > 1) {
        throw new Error('Each emitter can only have one Address. Invoice-explorer is '
        + 'authorizing more than one company for each address, and this dashboard was not '
        + 'made to support this');
      }
      count += 1;
      resolve(processItem(companies[0], item.address));
    }));
    await Promise.all(promises);
  }

  console.log(`INFO - Found ${count} new company authorizations.`);
}
