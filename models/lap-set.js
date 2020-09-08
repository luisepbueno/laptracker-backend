const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Track = require('./track');

const LapSet = sequelize.define(
    'lap_set',
    {
        id: {
            type: Sequelize.DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        lap_count: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false
        },
        best_time: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        track: {
            type: Sequelize.DataTypes.INTEGER,
            references: {
                model: Track,
                key: 'id'
            }
        }
    }
);

module.exports = LapSet;
