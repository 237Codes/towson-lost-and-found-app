import mysql from 'mysql2/promise';

export async function POST({ request }) {
  // Get data from the form
  const data = await request.json();

  const {
    name,
    email,
    phone,
    itemName,
    category,
    colors,
    brand,
    description,
    location,
    date,
    dropoff,
    contactMethod,
    canContact,
    verificationTip,
    type
  } = data;  

  // Connect to DB
  const connection = await mysql.createConnection({
    host: import.meta.env.DB_HOST,
    port: Number(import.meta.env.DB_PORT),
    user: import.meta.env.DB_USER,
    password: import.meta.env.DB_PASSWORD,
    database: import.meta.env.DB_NAME,
  });

  // Insert into database
  const query = `
    INSERT INTO items 
    (name, email, phone, itemName, category, colors, brand, description, location, date, dropoff, contactMethod, canContact, verificationTip, confirm, type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
    name,
    email,
    phone,
    itemName,
    category,
    colors.join(','), // convert array to string
    brand,
    description,
    location,
    date,
    dropoff,
    contactMethod,
    canContact ? 1 : 0,
    verificationTip,
    true, // assuming confirm is always true if they submitted
    type // lost or found
  ];  

  await connection.execute(query, values);
  await connection.end();

  return new Response(JSON.stringify({ message: 'Found item reported successfully!' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
