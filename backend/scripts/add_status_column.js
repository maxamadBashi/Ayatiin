const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const runMigration = async () => {
    try {
        console.log('Connecting to database...');
        const client = await pool.connect();
        console.log('Connected. Adding status column to Tenant table...');

        // Add status column if it doesn't exist
        await client.query(`
            ALTER TABLE "Tenant" 
            ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'active';
        `);

        console.log('Successfully added "status" column.');
        client.release();
        process.exit(0);
    } catch (err) {
        console.error('Error running migration:', err);
        process.exit(1);
    }
};

runMigration();
