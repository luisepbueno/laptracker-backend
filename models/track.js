const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Track = sequelize.define(
    'track',
    {
        id: {
            type: Sequelize.DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        }
    }
);

module.exports = Track;
