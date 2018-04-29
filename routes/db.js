const {Pool, Client} = require('pg');
const client = new Client({
    user: 'cowvlkyfaedxxf',
    host: 'ec2-23-21-121-220.compute-1.amazonaws.com',
    database: 'd3f7nva3ceabkk',
    password: '9bf20a826e17e7424cd4a75816dc1652d9192b4f884c3b106641d46249625e70',
    port: 5432
});

const pool = new Pool({
    user: 'cowvlkyfaedxxf',
    host: 'ec2-23-21-121-220.compute-1.amazonaws.com',
    database: 'd3f7nva3ceabkk',
    password: '9bf20a826e17e7424cd4a75816dc1652d9192b4f884c3b106641d46249625e70',
    port: 5432,
    ssl: true
});

const close = function () {
    client.end()
};

module.exports = {
    connect: function () {
        client.connect()
    },
    close: function () {
        client.end()
    },
    query: (text, params, callback) => {
        return pool.query(text, params, callback)
    }
};