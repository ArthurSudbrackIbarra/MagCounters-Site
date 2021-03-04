const Sequelize = require("sequelize");

const sequelizeConfig = require("../../sequelize-config.json");

const connection = new Sequelize("magcounters", sequelizeConfig.user, sequelizeConfig.password, {
    host: "localhost",
    dialect: "mysql",
});

module.exports = connection;