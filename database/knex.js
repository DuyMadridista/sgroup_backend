const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: 'duy432003',
        database: 'duy'
    }
});
module.exports = knex;