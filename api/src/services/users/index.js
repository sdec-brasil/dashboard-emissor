import models from '../../models';
import { errors, requests, chain } from '../../utils';


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
  const address = await chain.generateAddress();
  const { walletId } = req.user;
  console.log('address', address);
  return models.address.create({ id: address, walletId })
    .then(createdAddress => ({ code: 200, data: createdAddress }))
    .catch((err) => {
      throw err;
    });
};

export default {
  getUserInfo,
  updateUser,
  createNewUser,
  registerNewAddress,
};
