const mysql = require('mysql2/promise');
require('dotenv').config();

async function killAllConnections() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.PORT ? parseInt(process.env.PORT) : 3306,
    });

    const [processes] = await connection.query("SHOW PROCESSLIST");

    const myUser = process.env.DB_USER;
    const myThreadId = connection.threadId;

    const killPromises = processes
      .filter(p => p.User === myUser && p.Id !== myThreadId)
      .map(p => {
        console.log(`Killing connection ID: ${p.Id} (Host: ${p.Host}, DB: ${p.DB}, Command: ${p.Command})`);
        return connection.query(`KILL ${p.Id}`);
      });

    await Promise.all(killPromises);
    console.log(`✅ Killed ${killPromises.length} connection(s).`);

  } catch (error) {
    console.error("❌ Error killing connections:", error.message);
  } finally {
    if (connection) await connection.end();
  }
}

killAllConnections();
