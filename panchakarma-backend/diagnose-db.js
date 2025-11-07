const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function diagnose() {
  let connection;
  
  try {
    console.log('🔍 DIAGNOSING DATABASE ISSUES...\n');
    
    // Step 1: Test connection
    console.log('Step 1: Testing MySQL connection...');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`Port: ${process.env.DB_PORT}\n`);
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'panchakarma_db',
      port: process.env.DB_PORT || 3306,
    });
    
    console.log('✅ MySQL connection successful!\n');
    
    // Step 2: Check if users table exists
    console.log('Step 2: Checking users table...');
    const [tables] = await connection.query("SHOW TABLES LIKE 'users'");
    
    if (tables.length === 0) {
      console.log('❌ Users table does NOT exist!');
      console.log('🔧 Run: npm run setup-db\n');
      process.exit(1);
    }
    
    console.log('✅ Users table exists\n');
    
    // Step 3: Check table structure
    console.log('Step 3: Checking table structure...');
    const [columns] = await connection.query("DESCRIBE users");
    console.log('Columns:', columns.map(c => c.Field).join(', '));
    console.log('');
    
    // Step 4: Check existing users
    console.log('Step 4: Checking existing users...');
    const [users] = await connection.query('SELECT id, name, email, role, password FROM users');
    console.log(`Found ${users.length} users:\n`);
    
    if (users.length === 0) {
      console.log('❌ No users found! Database is empty.');
      console.log('🔧 Run: npm run setup-db\n');
      process.exit(1);
    }
    
    // Step 5: Test each user's password
    console.log('Step 5: Testing passwords...\n');
    let hasIssues = false;
    
    for (const user of users) {
      console.log(`👤 ${user.email} (${user.role})`);
      console.log(`   Name: ${user.name}`);
      
      // Test appropriate password
      let testPassword;
      if (user.role === 'admin') testPassword = 'admin123';
      else if (user.role === 'doctor') testPassword = 'doctor123';
      else testPassword = null;
      
      if (testPassword) {
        const isValid = await bcrypt.compare(testPassword, user.password);
        console.log(`   Password '${testPassword}': ${isValid ? '✅ VALID' : '❌ INVALID'}`);
        
        if (!isValid) {
          hasIssues = true;
          console.log(`   🔧 Fixing password...`);
          const newHash = await bcrypt.hash(testPassword, 10);
          await connection.query('UPDATE users SET password = ? WHERE id = ?', [newHash, user.id]);
          console.log(`   ✅ Password fixed!`);
        }
      } else {
        console.log(`   ⚠️  Patient account - skipping password test`);
      }
      console.log('');
    }
    
    if (hasIssues) {
      console.log('🔧 Some passwords were fixed. Try logging in again.\n');
    } else {
      console.log('✅ All passwords are valid!\n');
    }
    
    // Step 6: Test login simulation
    console.log('Step 6: Simulating login for admin@niramay.com...');
    const [testUsers] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      ['admin@niramay.com']
    );
    
    if (testUsers.length === 0) {
      console.log('❌ Admin user not found!\n');
      process.exit(1);
    }
    
    const testUser = testUsers[0];
    const testPassword = 'admin123';
    const passwordValid = await bcrypt.compare(testPassword, testUser.password);
    
    if (passwordValid) {
      console.log('✅ Login simulation SUCCESSFUL!');
      console.log(`\n🎉 DATABASE IS WORKING CORRECTLY!`);
      console.log(`\nYou can login with:`);
      console.log(`   Email: admin@niramay.com`);
      console.log(`   Password: admin123\n`);
      console.log(`If login still fails, the backend server might not be running.`);
      console.log(`Start it with: npm start\n`);
    } else {
      console.log('❌ Login simulation FAILED!\n');
    }
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nPossible issues:');
    console.error('  1. MySQL is not running');
    console.error('  2. Wrong database credentials in .env');
    console.error('  3. Database not created (run: npm run setup-db)');
    console.error('  4. MySQL user lacks permissions\n');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

diagnose();
