const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function testConnection() {
    try {
        console.log('Testing connection to:', process.env.DATABASE_URL.split('@')[1]);
        const client = await pool.connect();
        console.log('Successfully connected to the database!');
        const res = await client.query('SELECT NOW()');
        console.log('Server time:', res.rows[0].now);
        client.release();
        process.exit(0);
    } catch (err) {
        console.error('Connection failed:', err.message);
        process.exit(1);
    }
}

testConnection();
