const mysql = require('mysql2/promise');

// MySQL database connection configuration
const dbConfig = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'BokuNoPico2008',
  database: 'optisched_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

module.exports = {
  pool,
  dbConfig
};
