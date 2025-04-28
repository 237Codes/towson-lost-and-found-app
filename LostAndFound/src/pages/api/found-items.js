import mysql from "mysql2/promise";

export async function GET() {
    const connection = await mysql.createConnection({
        host: import.meta.env.VITE_DB_HOST,
        port: Number(import.meta.env.VITE_DB_PORT),
        user: import.meta.env.VITE_DB_USER,
        password: import.meta.env.VITE_DB_PASSWORD,
        database: import.meta.env.VITE_DB_NAME
      });
      

  const [rows] = await connection.execute(
    "SELECT * FROM items WHERE type = 'found'"
  );

  await connection.end();

  return new Response(JSON.stringify(rows), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
