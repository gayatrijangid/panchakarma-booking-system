const bcrypt = require('bcryptjs');
const { pool } = require('./config/database');

async function addDoctors() {
  try {
    console.log('🏥 Adding specialist doctors...\n');

    // Hash password for all doctors
    const password = '';
    const hashedPassword = await bcrypt.hash(password, 10);

    const doctors = [
      {
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma@niramay.com',
        phone: '+91-9876543211',
        specialization: 'Panchakarma Detox Specialist',
        experience: '8 years',
        qualifications: 'BAMS, MD (Ayurveda), Panchakarma Specialist',
        about: 'Expert in traditional Panchakarma detoxification therapies with over 8 years of experience in holistic healing and body purification treatments.'
      },
      {
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@niramay.com',
        phone: '+91-9876543212',
        specialization: 'Abhyanga & Massage Therapy',
        experience: '12 years',
        qualifications: 'BAMS, PhD (Ayurveda), Marma Therapy Expert',
        about: 'Senior Ayurvedic physician specializing in Abhyanga massage and Marma therapy. Expertise in therapeutic oil treatments and stress management.'
      },
      {
        name: 'Dr. Anjali Menon',
        email: 'anjali.menon@niramay.com',
        phone: '+91-9876543213',
        specialization: 'Shirodhara & Stress Management',
        experience: '10 years',
        qualifications: 'BAMS, MD (Ayurveda), Yoga Therapist',
        about: 'Specialist in Shirodhara therapy and mind-body healing. Expert in treating stress, anxiety, and sleep disorders through ancient Ayurvedic practices.'
      },
      {
        name: 'Dr. Arjun Patel',
        email: 'arjun.patel@niramay.com',
        phone: '+91-9876543214',
        specialization: 'Ayurvedic Consultation & Diagnosis',
        experience: '15 years',
        qualifications: 'BAMS, MD (Ayurveda), Nadi Pariksha Expert',
        about: 'Senior consultant with expertise in Ayurvedic diagnosis, pulse reading (Nadi Pariksha), and personalized treatment planning for chronic conditions.'
      },
      {
        name: 'Dr. Lakshmi Iyer',
        email: 'lakshmi.iyer@niramay.com',
        phone: '+91-9876543215',
        specialization: 'Wellness & Rejuvenation Therapy',
        experience: '9 years',
        qualifications: 'BAMS, MSc (Ayurveda), Nutrition Expert',
        about: 'Specialist in rejuvenation therapies, Ayurvedic nutrition, and lifestyle management. Focus on preventive healthcare and immunity building.'
      }
    ];

    console.log('Adding doctors to database...\n');

    for (const doctor of doctors) {
      // Check if doctor already exists
      const [existing] = await pool.query(
        'SELECT id FROM users WHERE email = ?',
        [doctor.email]
      );

      if (existing.length > 0) {
        console.log(`⚠️  ${doctor.name} already exists, skipping...`);
        continue;
      }

      // Insert doctor
      const [result] = await pool.query(
        `INSERT INTO users (name, email, password, role, phone, specialization, experience, qualifications, about, status) 
         VALUES (?, ?, ?, 'doctor', ?, ?, ?, ?, ?, 'active')`,
        [
          doctor.name,
          doctor.email,
          hashedPassword,
          doctor.phone,
          doctor.specialization,
          doctor.experience,
          doctor.qualifications,
          doctor.about
        ]
      );

      console.log(`✅ ${doctor.name} added successfully (ID: ${result.insertId})`);
      console.log(`   📧 Email: ${doctor.email}`);
      console.log(`   🏥 Specialization: ${doctor.specialization}`);
      console.log('');
    }

    console.log('🎉 All doctors added successfully!\n');
    console.log('📋 Login Credentials for all doctors:');
    console.log('   Password: doctor123\n');
    console.log('Emails:');
    doctors.forEach(doctor => {
      console.log(`   - ${doctor.email}`);
    });
    console.log('');

    // Display summary
    const [doctorsList] = await pool.query(
      'SELECT id, name, email, specialization, experience FROM users WHERE role = "doctor" ORDER BY id'
    );

    console.log('📊 Current Doctors in System:');
    console.log('═'.repeat(80));
    doctorsList.forEach((doc, index) => {
      console.log(`${index + 1}. ${doc.name}`);
      console.log(`   Email: ${doc.email}`);
      console.log(`   Specialization: ${doc.specialization}`);
      console.log(`   Experience: ${doc.experience}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nMake sure:');
    console.error('  1. MySQL is running');
    console.error('  2. Database exists (run: npm run setup-db)');
    console.error('  3. .env file has correct credentials');
    process.exit(1);
  }
}

addDoctors();
