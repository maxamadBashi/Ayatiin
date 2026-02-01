const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function fixPropertyColumns() {
    const client = await pool.connect();

    try {
        console.log('🔄 Adding snake_case columns to Property table...');

        // The prisma-emulator converts camelCase to snake_case
        // So we need both ownerName AND owner_name
        await client.query(`
            ALTER TABLE "Property" 
            ADD COLUMN IF NOT EXISTS "owner_name" TEXT;
        `);
        console.log('✅ owner_name column added');

        // Copy data from ownerName to owner_name if ownerName exists
        await client.query(`
            UPDATE "Property" 
            SET "owner_name" = "ownerName"
            WHERE "ownerName" IS NOT NULL AND "owner_name" IS NULL;
        `);
        console.log('✅ Copied ownerName data to owner_name');

        // Verify columns
        const result = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'Property'
            ORDER BY column_name;
        `);

        console.log('\n📋 Current Property table columns:');
        result.rows.forEach(row => console.log(`  - ${row.column_name}`));

    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

fixPropertyColumns()
    .then(() => {
        console.log('\n✅ Migration completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    });
