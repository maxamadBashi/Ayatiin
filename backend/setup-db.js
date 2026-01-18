const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, './.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const sql = `
-- Enums
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserRole') THEN
        CREATE TYPE "UserRole" AS ENUM ('customer', 'admin', 'manager', 'superadmin', 'tenant', 'accountant');
    ELSE
        ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'accountant';
    END IF;
END $$;

DO $$ BEGIN
    CREATE TYPE "PropertyType" AS ENUM ('Apartment', 'House', 'Villa', 'Land', 'Commercial', 'Land for Sale', 'Commercial Land', 'Residential Land', 'Farm Land', 'Investment Land');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "PropertyStatus" AS ENUM ('available', 'rented', 'sold');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tables
CREATE TABLE IF NOT EXISTS "User" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role "UserRole" NOT NULL DEFAULT 'customer',
    is_blocked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Property" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    type "PropertyType" NOT NULL DEFAULT 'Apartment',
    size TEXT,
    dimensions TEXT,
    price DOUBLE PRECISION,
    bedrooms INTEGER,
    bathrooms INTEGER,
    description TEXT,
    status "PropertyStatus" NOT NULL DEFAULT 'available',
    images TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Unit" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES "Property"(id) ON DELETE CASCADE,
    unit_number TEXT NOT NULL,
    type TEXT NOT NULL,
    rent_amount DOUBLE PRECISION NOT NULL,
    status TEXT NOT NULL DEFAULT 'available',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Tenant" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES "User"(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    id_number TEXT,
    emergency_contact TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Lease" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID NOT NULL REFERENCES "Unit"(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES "Tenant"(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rent_amount DOUBLE PRECISION NOT NULL,
    deposit DOUBLE PRECISION NOT NULL DEFAULT 0,
    rent_cycle TEXT NOT NULL DEFAULT 'monthly',
    auto_invoice BOOLEAN NOT NULL DEFAULT true,
    guarantor_name TEXT,
    guarantor_phone TEXT,
    guarantor_id TEXT,
    conditions TEXT,
    vehicle_make TEXT,
    vehicle_model TEXT,
    vehicle_plate TEXT,
    weapon_type TEXT,
    weapon_license TEXT,
    witness1_name TEXT,
    witness1_phone TEXT,
    witness1_id TEXT,
    witness2_name TEXT,
    witness2_phone TEXT,
    witness2_id TEXT,
    witness3_name TEXT,
    witness3_phone TEXT,
    witness3_id TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Migrations for existing Lease table
DO $$ BEGIN
    ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS deposit DOUBLE PRECISION DEFAULT 0;
    ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS rent_cycle TEXT DEFAULT 'monthly';
    ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS auto_invoice BOOLEAN DEFAULT true;
    ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS guarantor_name TEXT;
    ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS guarantor_phone TEXT;
    ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS guarantor_id TEXT;
    ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS conditions TEXT;
    ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS vehicle_make TEXT;
    ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS vehicle_model TEXT;
    ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS vehicle_plate TEXT;
    ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS weapon_type TEXT;
    ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS weapon_license TEXT;
    ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS witness1_name TEXT;
    ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS witness1_phone TEXT;
    ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS witness1_id TEXT;
    ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS witness2_name TEXT;
    ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS witness2_phone TEXT;
    ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS witness2_id TEXT;
    ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS witness3_name TEXT;
    ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS witness3_phone TEXT;
    ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS witness3_id TEXT;
END $$;

CREATE TABLE IF NOT EXISTS "Payment" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lease_id UUID NOT NULL REFERENCES "Lease"(id) ON DELETE CASCADE,
    amount DOUBLE PRECISION NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    reference_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Maintenance" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES "Property"(id) ON DELETE SET NULL,
    unit_id UUID REFERENCES "Unit"(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    issue TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'pending',
    cost DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Request" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "AuditLog" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Expense" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    property_id UUID REFERENCES "Property"(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Setting" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL DEFAULT 'Ayatiin Property Management',
    company_logo TEXT,
    currency TEXT NOT NULL DEFAULT 'USD',
    payment_methods TEXT, -- JSON string
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

const setup = async () => {
    try {
        console.log('Connecting to database...');
        const client = await pool.connect();
        try {
            console.log('Executing schema SQL...');
            await client.query(sql);
            // Create Guarantor table
            await client.query(`
        CREATE TABLE IF NOT EXISTS "Guarantor" (
            "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            "name" TEXT NOT NULL,
            "phone" TEXT NOT NULL,
            "email" TEXT,
            "id_number" TEXT,
            "id_photo" TEXT,
            "work_id_photo" TEXT,
            "work_info" TEXT,
            "status" TEXT DEFAULT 'active',
            "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `);

            // Add guarantor_id to Lease (Postgres uses snake_case, Prisma uses camelCase)
            try {
                await client.query('ALTER TABLE "Lease" ADD COLUMN "guarantor_id" UUID REFERENCES "Guarantor"(id)');
            } catch (e) {
                // Column might already exist
            }

            console.log('Database schema updated successfully (Guarantor added)');
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error during setup:', error);
    } finally {
        await pool.end();
    }
};

setup();
