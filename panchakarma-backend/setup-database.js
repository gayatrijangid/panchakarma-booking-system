const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔧 Starting database setup...\n');

    // Connect to MySQL (without selecting database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL server');

    // Read and execute schema file
    console.log('📋 Creating database and tables...');
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schemaSql = await fs.readFile(schemaPath, 'utf8');
    await connection.query(schemaSql);
    console.log('✅ Database schema created');

    // Read and execute seed file
    console.log('🌱 Seeding initial data...');
    const seedPath = path.join(__dirname, 'database', 'seed.sql');
    const seedSql = await fs.readFile(seedPath, 'utf8');
    await connection.query(seedSql);
    console.log('✅ Initial data seeded');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\nDemo Accounts:');
    console.log('  Admin: admin@niramay.com / admin123');
    console.log('  Doctor: doctor@niramay.com / doctor123');
    console.log('\n✨ You can now start the server with: npm start');

  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    console.error('\nPlease check:');
    console.error('  1. MySQL is running');
    console.error('  2. Credentials in .env file are correct');
    console.error('  3. MySQL user has proper permissions');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run setup
setupDatabase();
