module.exports = function(sequelize, DataTypes) {
	return sequelize.define('txout', {
		'txout_id': {
			type: DataTypes.DOUBLE,
			allowNull: false,
			primaryKey: true
		},
		'tx_id': {
			type: DataTypes.DOUBLE,
			allowNull: false
		},
		'txout_pos': {
			type: DataTypes.DOUBLE,
			allowNull: false
		},
		'txout_value': {
			type: DataTypes.DOUBLE,
			allowNull: false
		},
		'txout_scriptPubKey': {
			type: "VARBINARY(1000000)",
			allowNull: true
		},
		'pubkey_id': {
			type: DataTypes.DOUBLE,
			allowNull: true,
			references: {
				model: 'pubkey',
				key: 'pubkey_id'
			}
		}
	}, {
		tableName: 'txout'
	});
};
