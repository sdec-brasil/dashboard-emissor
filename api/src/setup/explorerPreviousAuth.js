import axios from 'axios';
import models from '../models';

const { Op } = models.Sequelize;

const getFreeWallets = (limit, time) => models.address.findAll({
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

const processItem = async (item) => {
  Promise(async (resolve) => {
    const addr = await models.address.findByPk(item.address);
    const user = await models.user.findOne({
      walletId: addr.get('walletId'),
    });

    const company = await models.empresa.create({
      ...item.Empresa,
      user_id: user.get('id'),
    });
    await addr.update({ walletId: company.get('walletId') });
    resolve(true);
  });
};


export default async function () {
  console.log('SETUP - Querying explorer for previous authorizations...');
  let count = 0;
  const now = new Date();
  const limit = 30;
  let freeAddresses = await getFreeWallets(limit, now);
  while (freeAddresses.length) {
    let addressesIds = freeAddresses.map(item => item.address);
    addressesIds = addressesIds.join(' ');
    const response = await axios.get('http://159.89.86.197:8000/v1/emitters',
      {
        params: {
          filter: `address in ${addressesIds}`,
        },
      });
    await Promise.all(response.map(processItem));
    count += response.length;
    freeAddresses = await getFreeWallets(limit, now);
  }

  console.log(`INFO - Found ${count} new company authorizations.`);
}
