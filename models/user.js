const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const User = sequelize.define(
    'user',
    {
        id: {
            type: Sequelize.DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        }
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['email']
            }
        ]
    }
);

module.exports = User;
