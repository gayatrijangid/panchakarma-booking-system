const bcrypt = require('bcryptjs');
const { pool } = require('./config/database');

async function testLogin() {
  try {
    const email = 'admin@niramay.com';
    const password = 'admin123';

    console.log(`🧪 Testing login for: ${email}\n`);

    // Find user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      console.log('❌ User not found');
      process.exit(1);
    }

    const user = users[0];
    console.log(`✅ User found: ${user.name} (${user.role})`);
    console.log(`   Password hash: ${user.password.substring(0, 30)}...`);

    // Test password
    console.log(`\n🔐 Testing password: ${password}`);
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (isValidPassword) {
      console.log('✅ Password is VALID!');
      console.log('\n✨ Login should work with:');
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${password}`);
    } else {
      console.log('❌ Password is INVALID!');
      console.log('\n🔧 Fixing password...');
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        'UPDATE users SET password = ? WHERE email = ?',
        [hashedPassword, email]
      );
      console.log('✅ Password updated successfully!');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testLogin();
