const mysql = require('mysql2/promise');

// Create a connection pool to the MySQL database
// We use a pool instead of a single connection to handle multiple concurrent requests efficiently.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password', // Default fallback for local dev
  database: process.env.DB_NAME || 'user_directory',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
