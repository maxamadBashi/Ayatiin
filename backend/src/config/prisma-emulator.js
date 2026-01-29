const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const fs = require('fs');
const logFile = path.resolve(__dirname, '../../emulator.log');

const execute = async (query, params) => {
    const client = await pool.connect();
    try {
        if (process.env.NODE_ENV !== 'production') {
            const logMsg = `[${new Date().toISOString()}] QUERY: ${query} | PARAMS: ${JSON.stringify(params)}\n`;
            try {
                fs.appendFileSync(logFile, logMsg);
            } catch (e) {
                console.warn('Could not write to emulator.log:', e.message);
            }
        }
        const res = await client.query(query, params);
        return res;
    } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
            try {
                fs.appendFileSync(logFile, `[ERROR] ${err.message}\n`);
            } catch (e) {
                console.error('Error writing to emulator.log:', e.message);
            }
        }
        throw err;
    } finally {
        client.release();
    }
};

const toCamel = (row) => {
    if (!row) return null;
    const newRow = {};
    for (let key in row) {
        const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        newRow[camelKey] = row[key];
    }
    return newRow;
};

const toSnake = (obj) => {
    if (!obj) return null;
    const newObj = {};
    for (let key in obj) {
        const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
        newObj[snakeKey] = obj[key];
    }
    return newObj;
};

class Model {
    constructor(table) {
        this.table = table;
    }

    async findMany({ where, include } = {}) {
        let query = `SELECT * FROM "${this.table}"`;
        const params = [];
        if (where) {
            const keys = Object.keys(where);
            if (keys.length > 0) {
                const conditions = [];
                keys.forEach(key => {
                    const value = where[key];
                    const snakeKey = toSnake({ [key]: '' });
                    const column = Object.keys(snakeKey)[0];

                    if (value && typeof value === 'object' && value.in) {
                        const inArray = Array.isArray(value.in) ? value.in : [value.in];
                        const inPlaceholders = inArray.map((_, i) => `$${params.length + i + 1}`).join(', ');
                        conditions.push(`"${column}" IN (${inPlaceholders})`);
                        params.push(...inArray);
                    } else {
                        params.push(value);
                        conditions.push(`"${column}" = $${params.length}`);
                    }
                });
                query += ` WHERE ` + conditions.join(' AND ');
            }
        }
        const res = await execute(query, params);
        return res.rows.map(toCamel);
    }

    async findUnique({ where, include } = {}) {
        const params = [];
        const conditions = [];
        const keys = Object.keys(where);
        keys.forEach(key => {
            const snakeKey = toSnake({ [key]: '' });
            const column = Object.keys(snakeKey)[0];
            params.push(where[key]);
            conditions.push(`"${column}" = $${params.length}`);
        });
        const query = `SELECT * FROM "${this.table}" WHERE ` + conditions.join(' AND ') + ` LIMIT 1`;
        const res = await execute(query, params);
        return toCamel(res.rows[0]);
    }

    async create({ data, include } = {}) {
        // Basic implementation for now, might need to handle arrays for 'images'
        const snakeData = toSnake(data);
        const keys = Object.keys(snakeData);
        const values = Object.values(snakeData);
        const query = `INSERT INTO "${this.table}" (${keys.map(k => `"${k}"`).join(', ')}) VALUES (${keys.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`;
        const res = await execute(query, values);
        return toCamel(res.rows[0]);
    }

    async update({ where, data } = {}) {
        const snakeData = toSnake(data);
        const setKeys = Object.keys(snakeData);
        const setValues = Object.values(snakeData);

        const params = [...setValues];
        const setConditions = setKeys.map((k, i) => `"${k}" = $${i + 1}`);

        const whereConditions = [];
        Object.keys(where).forEach(key => {
            const snakeKey = toSnake({ [key]: '' });
            const column = Object.keys(snakeKey)[0];
            params.push(where[key]);
            whereConditions.push(`"${column}" = $${params.length}`);
        });

        let query = `UPDATE "${this.table}" SET ` + setConditions.join(', ');
        query += ` WHERE ` + whereConditions.join(' AND ') + ` RETURNING *`;

        const res = await execute(query, params);
        return toCamel(res.rows[0]);
    }

    async delete({ where } = {}) {
        const params = [];
        const conditions = [];
        Object.keys(where).forEach(key => {
            const snakeKey = toSnake({ [key]: '' });
            const column = Object.keys(snakeKey)[0];
            params.push(where[key]);
            conditions.push(`"${column}" = $${params.length}`);
        });
        const query = `DELETE FROM "${this.table}" WHERE ` + conditions.join(' AND ');
        await execute(query, params);
        return { success: true };
    }

    async count({ where } = {}) {
        let query = `SELECT COUNT(*) FROM "${this.table}"`;
        const params = [];
        if (where) {
            const keys = Object.keys(where);
            if (keys.length > 0) {
                const conditions = [];
                keys.forEach(key => {
                    const value = where[key];
                    const snakeKey = toSnake({ [key]: '' });
                    const column = Object.keys(snakeKey)[0];

                    if (value && typeof value === 'object' && value.in) {
                        const inArray = Array.isArray(value.in) ? value.in : [value.in];
                        const inPlaceholders = inArray.map((_, i) => `$${params.length + i + 1}`).join(', ');
                        conditions.push(`"${column}" IN (${inPlaceholders})`);
                        params.push(...inArray);
                    } else {
                        params.push(value);
                        conditions.push(`"${column}" = $${params.length}`);
                    }
                });
                query += ` WHERE ` + conditions.join(' AND ');
            }
        }
        const res = await execute(query, params);
        return parseInt(res.rows[0].count);
    }
}

const prisma = {
    $connect: async () => {
        const client = await pool.connect();
        client.release();
    },
    user: new Model('User'),
    property: new Model('Property'),
    unit: new Model('Unit'),
    tenant: new Model('Tenant'),
    lease: new Model('Lease'),
    payment: new Model('Payment'),
    maintenance: new Model('Maintenance'),
    request: new Model('Request'),
    auditLog: new Model('AuditLog'),
    expense: new Model('Expense'),
    setting: new Model('Setting'),
    guarantor: new Model('Guarantor'),
};

module.exports = { prisma };
