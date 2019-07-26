// Wallet
export default function (sequelize, DataTypes) {
  const wallet = sequelize.define('wallet', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
  }, {
    underscored: true,
    tableName: 'wallet',
  });

  return wallet;
}
