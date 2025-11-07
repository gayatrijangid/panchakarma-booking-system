const bcrypt = require('bcryptjs');
const { pool } = require('./config/database');

async function checkUsers() {
  try {
    console.log('🔍 Checking users in database...\n');

    // Get all users
    const [users] = await pool.query('SELECT id, name, email, role, password FROM users');
    
    console.log(`Found ${users.length} users:\n`);
    
    for (const user of users) {
      console.log(`📧 ${user.email} (${user.role})`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Password hash: ${user.password.substring(0, 20)}...`);
      
      // Test password
      const testPassword = user.role === 'admin' ? 'admin123' : 'doctor123';
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log(`   Test password '${testPassword}': ${isValid ? '✅ VALID' : '❌ INVALID'}`);
      console.log('');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUsers();
