const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tareas',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection() {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log("MySQL connection OK");
    } catch (error) {
        if (!error.message)
            console.log("Error conexion Xampp");
        else
            console.log("MySQL connection failed: " + error.message);
    } finally {
        if (connection) connection.release();
    }
}

testConnection();

module.exports = pool;
