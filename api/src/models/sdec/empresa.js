import models from '../index';

// Empresa
export default function (sequelize, DataTypes) {
  const empresa = sequelize.define('empresa', {
    enderecoBlockchain: {
      type: DataTypes.STRING(45),
      unique: true,
      primaryKey: true,
      allowNull: false,
    },
    cnpj: {
      type: DataTypes.STRING(14),
      unique: true,
      allowNull: true,
    },
    razaoSocial: {
      type: DataTypes.STRING(150),
      unique: true,
      allowNull: true,
    },
    nomeFantasia: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    enderecoEmpresa: {
      type: DataTypes.STRING(125),
      allowNull: true,
    },
    numeroEndereco: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    complementoEndereco: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    bairroEndereco: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    cidadeEndereco: {
      type: DataTypes.STRING(7),
      allowNull: true,
    },
    unidadeFederacao: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    paisEndereco: {
      type: DataTypes.STRING(4),
      allowNull: true,
    },
    cep: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    underscored: false,
    tableName: 'empresa',
    freezeTableName: true,
    timestamps: false,
  });
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
