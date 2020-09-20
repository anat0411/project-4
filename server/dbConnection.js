const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost", // 127.0.0.1
  user: "anat_project",
  password: "81728172",
  database: "supermarket",
});

pool.on("connection", (conn) => {
  console.log(`New connection id: ${conn.threadId}`);
});

pool.on("acquire", (conn) => {
  console.log(`Acquire connection id: ${conn.threadId}`);
});

pool.on("enqueue", () => {
  console.log("Waiting for available connection slot");
});

pool.on("release", (conn) => {
  console.log(`Connection ${conn.threadId} released`);
});

module.exports = { pool };
