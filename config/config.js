require('dotenv').config({path : `${process.cwd()}/.env`});

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port : process.env.DB_PORT,
    dialect: "postgres",
    // whatever the seeder file get executed so that all the seeder inforamtion will be store into db
    seederStorage: "sequelize",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port : process.env.DB_PORT,
    dialect: "postgres",
  }
}
