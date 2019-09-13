import models from '../index';

// Empresa
export default function (sequelize, DataTypes) {
  const empresa = sequelize.define('empresa', {
    taxNumber: {
      type: DataTypes.STRING(14),
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(150),
      unique: true,
      allowNull: false,
    },
    tradeName: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    postalCode: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING(125),
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    additionalInformation: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    district: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(7),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    taxRegime: {
      // 1 - MEI;
      // 2 - Simples Nacional;
      // 3 - Lucro Presumido;
      // 4 - Lucro Real;
      type: DataTypes.TINYINT({ unsigned: true }),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    endBlock: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    underscored: false,
    tableName: 'empresa',
    freezeTableName: true,
    timestamps: false,
  });
  // falta pegar a lista de cnaes

  empresa.associate = (models) => {
    empresa.belongsTo(models.user, { targetKey: 'id', foreignKey: { name: 'user_id', allowNull: false } });
    empresa.belongsTo(models.wallet, { targetKey: 'id', foreignKey: { name: 'walletId', allowNull: true } });
  };

  empresa.beforeValidate(async (instance, options) => {
    if (instance.isNewRecord) {
      // create a wallet for user available keys
      const wallet = await models.wallet.create();
      const walletInfo = wallet.get({ plain: true });
      instance.dataValues.walletId = walletInfo.id;
    }
    return instance;
  });

  return empresa;
}
