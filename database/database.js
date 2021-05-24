const Sequelize = require('sequelize');

const connection = new Sequelize('guiaPerguntas','root','root',{
    host: 'localhost',
    port: '3306',
    dialect: 'mysql'
});

module.exports = connection;