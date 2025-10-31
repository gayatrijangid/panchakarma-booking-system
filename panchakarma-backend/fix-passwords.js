const bcrypt = require('bcryptjs');
const { pool } = require('./config/database');

async function fixPasswords() {
  try {
    console.log('🔧 Fixing admin and doctor passwords...\n');

    // Hash the passwords
    const adminHash = await bcrypt.hash('admin123', 10);
    const doctorHash = await bcrypt.hash('doctor123', 10);

    // Update admin password
    await pool.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [adminHash, 'admin@niramay.com']
    );
    console.log('✅ Admin password updated');

    // Update doctor passwords
    await pool.query(
      'UPDATE users SET password = ? WHERE email IN (?, ?)',
      [doctorHash, 'doctor@niramay.com', 'doctor2@niramay.com']
    );
    console.log('✅ Doctor passwords updated');

    console.log('\n🎉 All passwords fixed!\n');
    console.log('You can now login with:');
    console.log('  Admin: admin@niramay.com / admin123');
    console.log('  Doctor: doctor@niramay.com / doctor123');
    console.log('  Doctor 2: doctor2@niramay.com / doctor123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nMake sure:');
    console.error('  1. MySQL is running');
    console.error('  2. Database is created (run: npm run setup-db)');
    console.error('  3. .env file has correct credentials');
    process.exit(1);
  }
}

fixPasswords();
