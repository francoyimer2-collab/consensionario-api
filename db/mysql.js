const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST, 
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  user: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false 
  }
});

pool
  .getConnection()
  .then((conn) => {
    console.log("✅ Conexión a MySQL establecida correctamente");
    conn.release();
  })
  .catch((err) => {

    console.error("❌ Error crítico de conexión. Intentando conectar a:", process.env.MYSQLHOST || process.env.DB_HOST);
    console.error(err);
  });

module.exports = pool;
