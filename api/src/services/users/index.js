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
      delete userInstance.password;
      const companies = await models.empresa.findAll({
        raw: true,
        where: {
          user_id: req.user.id,
        },
        attributes: ['enderecoBlockchain'],
      });
      return Promise.resolve({ userInstance, companies });
    }
  })
  .then(({ userInstance, companies }) => {
    userInstance.addresses = companies;
    return { code: 200, data: userInstance };
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
  const enderecoBlockchain = await chain.generateAddress();
  return models.empresa.create({ enderecoBlockchain, user_id: req.user.id })
    .then((company) => {
      const info = company.get({ plain: true });
      const data = { enderecoBlockchain: info.enderecoBlockchain };
      return { code: 200, data };
    });
};

export default {
  getUserInfo,
  updateUser,
  createNewUser,
  registerNewAddress,
};
