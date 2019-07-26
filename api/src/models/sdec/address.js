// Address
export default function (sequelize, DataTypes) {
  const address = sequelize.define('address', {
    id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
    },
  }, {
    underscored: true,
    tableName: 'address',
  });

  address.associate = (models) => {
    address.belongsTo(models.wallet, { targetKey: 'id', foreignKey: { name: 'walletId', allowNull: false } });
  };

  return address;
}
