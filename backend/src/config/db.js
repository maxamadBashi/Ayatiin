const { prisma } = require('./prisma-emulator');

const connectDB = async () => {
  try {
    console.log('Connecting to PostgreSQL...');
    await prisma.$connect();
    console.log('PostgreSQL Connected successfully');
  } catch (error) {
    console.error('CRITICAL DATABASE ERROR:', error.message);
    console.error('Connection string used:', process.env.DATABASE_URL ? 'PRESENT (Masked)' : 'MISSING');
    // Do not exit in development if you want the server to keep trying or show errors
    if (process.env.NODE_ENV === 'production') {
      console.error('Exiting due to database connection failure in production.');
      process.exit(1);
    }
  }
};

module.exports = { connectDB, prisma };
