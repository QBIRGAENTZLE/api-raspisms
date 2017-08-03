const path = require('path');
const mysql = require('mysql');

const env = require(path.join(__dirname, 'env.json'));

const con = mysql.createConnection({
  host: env[process.env.NODE_ENV].database.host,
  user: 'root',
  password: 'raspberry',
  database: 'raspisms',
  multipleStatements: true,
});

con.connect((err) => {
  if (err) {
    throw err;
  }

  console.log('Connected!');
});

module.exports = con;
