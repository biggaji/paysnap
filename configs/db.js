const { Pool } = require("pg");

/**
 * An instance of a  postgresql pool connection
 */

const dbConnection = new Pool({
    //  database credentials
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    host: process.env.DBHOST,
    database: process.env.DATABASE,
    port: process.env.DBPORT
});

module.exports = {
    db: dbConnection
}