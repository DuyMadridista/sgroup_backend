const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: '122.248.225.255',
        port: 3307,
        user: 'duy432003',
        password: 'duy432003',
        database: 'duy'
    }
});
module.exports = knex;