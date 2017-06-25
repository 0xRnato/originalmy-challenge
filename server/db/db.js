const orm = require('orm');
const config = {
    'host': process.env.DB_HOST,
    'database': process.env.DB_DB,
    'user': process.env.DB_USER,
    'password': process.env.DB_PW,
    'protocol': process.env.DB_PROTOCOL,
    'port': process.env.DB_PORT,
};

const db = orm.connect(config, (err) => {
    if (err) throw err;
    else console.log('Connection with database succeeded.');
});

module.exports = db;
