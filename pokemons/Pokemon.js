const Sequelize = require("sequelize");

const connection = require("../database/database-connection");

const Pokemon = connection.define("pokemons", {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    dexnumber: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    type1: {
        type: Sequelize.STRING,
        allowNull: false
    },
    type2: {
        type: Sequelize.STRING,
        allowNull: true
    },
    hp: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    atk: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    def: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    spatk: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    spdef: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    speed: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    bug: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    dark: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    dragon: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    electric: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    fairy: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    fighting: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    fire: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    flying: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    ghost: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    grass: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    ground: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    ice: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    normal: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    poison: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    psychic: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    rock: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    steel: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    water: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    ability1: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ability2: {
        type: Sequelize.STRING,
        allowNull: true
    },
    ability3: {
        type: Sequelize.STRING,
        allowNull: true
    },
    rarity: {
        type: Sequelize.CHAR,
        allowNull: false
    }

}, {
    timestamps: false
});

Pokemon.sync({ force: false });

module.exports = Pokemon;