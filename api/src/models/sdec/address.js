// Address
export default function (sequelize, DataTypes) {
  const address = sequelize.define('address', {
    address: {
      type: DataTypes.STRING(128),
      primaryKey: true,
    },
    privateKey: {
      type: DataTypes.STRING(128),
    },
    publicKey: {
      type: DataTypes.STRING(128),
    },
  }, {
    underscored: false,
    tableName: 'address',
  });

  address.associate = (models) => {
    address.belongsTo(models.wallet, { targetKey: 'id', foreignKey: { name: 'walletId', allowNull: false } });
  };

  return address;
}
