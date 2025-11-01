const sql = require('mssql');

const config = {
  server: 'localhost',
  database: 'SRBDdb',
  user: 'lab3',
  password: '123456',
  options: {
    trustedConnection: true,
    trustServerCertificate: true
  }
};

async function connect() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (err) {
    throw err;
  }
}

module.exports = { sql, connect };