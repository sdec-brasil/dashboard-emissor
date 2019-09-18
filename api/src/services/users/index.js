import models from '../../models';
import { errors, requests, chain } from '../../utils';

const { Op } = models.Sequelize;


const getUserInfo = async req => models.user.findOne({
  where: {
    id: req.user.id,
  },
  raw: true,
  attributes: ['id', 'name', 'username', 'createdAt', 'updatedAt'],
})
  .then(async (userInstance) => {
    if (userInstance === null) {
      throw new errors.NotFoundError('User', `id ${req.user.id}`);
    } else {
      // delete userInstance.password;
      const companies = await models.empresa.findAll({
        raw: true,
        where: {
          user_id: req.user.id,
        },
      });
      userInstance.companies = companies;
      const addresses = await models.address.findAll({
        raw: true,
        attributes: ['address'],
        where: {
          walletId: req.user.walletId,
        },
      });
      userInstance.wallet = addresses;
      return { code: 200, data: userInstance };
    }
  }).catch((err) => {
    throw err;
  });


const updateUser = async (req) => {
  const excludedKeys = ['id', 'createdAt', 'updatedAt'];
  return requests.patch(models.user, req.user.id, req, excludedKeys)
    .then((updatedUser) => {
    // remove password before returning the updated user
      delete updatedUser.password;
      return { code: 200, data: updatedUser };
    })
    .catch((err) => {
      throw err;
    });
};


const createNewUser = async (req) => {
  const newUserInfo = {
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
  };
  return models.user.create(newUserInfo)
    .then((newUser) => {
      newUser.password = undefined;
      return { code: 200, data: newUser };
    })
    .catch((err) => {
      throw err;
    });
};


const registerNewAddress = async (req) => {
  const [pair] = await chain.generateKeyPair();
  const { walletId } = req.user;
  return models.address.create(
    {
      address: pair.address,
      privateKey: pair.privkey,
      publicKey: pair.pubkey,
      walletId,
      userId: req.user.id,
    },
  )
    .then(createdAddress => ({
      code: 200,
      data:
      { address: createdAddress.get('address') },
    }))
    .catch((err) => {
      throw err;
    });
};


const getFreeAddresses = async req => models.address.findAll({
  raw: true,
  where: {
    walletId: req.user.walletId,
  },
  order: [['createdAt', 'DESC']],
})
  .then((addresses) => {
    const data = { data: addresses };
    return { code: 200, data };
  })
  .catch((err) => {
    throw err;
  });

const getRegisteredAddresses = async req => models.address.findAll({
  where: {
    userId: req.user.id,
    walletId: {
      [Op.not]: req.user.walletId,
    },
  },
  order: [['createdAt', 'DESC']],
})
  .then((addresses) => {
    const data = [];
    const p = addresses.map(addr => new Promise(async (resolve) => {
      const item = addr.get({ plain: true });
      const wallet = await addr.getWallet();
      const company = await models.empresa.findOne({ where: { walletId: wallet.id } });
      item.company = company;
      data.push(item);
      resolve(true);
    }));
    return Promise.all(p).then(() => ({ code: 200, data }));
  })

  .catch((err) => {
    throw err;
  });


export default {
  getUserInfo,
  updateUser,
  createNewUser,
  registerNewAddress,
  getFreeAddresses,
  getRegisteredAddresses,
};
