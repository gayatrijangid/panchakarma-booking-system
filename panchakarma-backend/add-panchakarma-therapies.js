require('dotenv').config();
const mysql = require('mysql2/promise');

const panchakarmaTherapies = [
  {
    name: 'Basti',
    description: 'Therapeutic enema treatment using medicated oils and decoctions to cleanse the colon, eliminate toxins, and balance Vata dosha. Highly effective for digestive and neurological disorders.',
    duration: '90 minutes',
    price: 3500.00,
    category: 'Panchakarma',
    benefits: ['Relieves constipation and backache', 'Eliminates toxins from colon', 'Improves joint pain', 'Enhances digestive health', 'Balances Vata dosha'],
    procedures: ['Initial consultation and assessment', 'Preparation with oil massage', 'Administration of medicated enema', 'Rest period for absorption', 'Post-treatment observation'],
    contraindications: ['Pregnancy', 'Severe weakness', 'Inflammatory bowel disease', 'Rectal bleeding'],
    expected_benefits: ['Improved digestion', 'Relief from chronic constipation', 'Enhanced vitality', 'Better joint mobility'],
    doctorEmail: 'priya.sharma@niramay.com'
  },
  {
    name: 'Nasya',
    description: 'Nasal administration of medicated oils and herbal preparations to clear sinus passages, improve breathing, and treat disorders above the shoulders including headaches and migraines.',
    duration: '45 minutes',
    price: 2000.00,
    category: 'Panchakarma',
    benefits: ['Clears nasal passages', 'Relieves sinusitis and headaches', 'Improves mental clarity', 'Enhances voice quality', 'Treats respiratory issues'],
    procedures: ['Facial massage and steam therapy', 'Nasal drops administration', 'Inhalation therapy', 'Post-treatment gargling', 'Rest and observation'],
    contraindications: ['Pregnancy', 'Acute fever', 'Immediately after meals', 'Heavy exercise'],
    expected_benefits: ['Clear breathing', 'Reduced sinus congestion', 'Enhanced mental focus', 'Better sleep quality'],
    doctorEmail: 'anjali.menon@niramay.com'
  },
  {
    name: 'Vamana',
    description: 'Medically induced emesis therapy to eliminate excess Kapha dosha and accumulated toxins from the upper respiratory and digestive tract. Performed under expert supervision.',
    duration: '120 minutes',
    price: 5000.00,
    category: 'Panchakarma',
    benefits: ['Treats asthma and chronic allergies', 'Removes excess mucus', 'Improves lung function', 'Clears skin disorders', 'Detoxifies upper body'],
    procedures: ['Pre-procedure preparation (3-7 days)', 'Morning medication intake', 'Supervised emesis process', 'Post-procedure rest', 'Dietary management'],
    contraindications: ['Pregnancy', 'Elderly patients', 'Young children', 'Heart disease', 'Severe weakness'],
    expected_benefits: ['Relief from respiratory disorders', 'Clearer skin', 'Improved breathing', 'Enhanced immunity'],
    doctorEmail: 'arjun.patel@niramay.com'
  },
  {
    name: 'Virechana',
    description: 'Therapeutic purgation therapy using herbal laxatives to eliminate excess Pitta dosha and toxins from the liver, gallbladder, and small intestine. Deep cleansing treatment.',
    duration: '60 minutes',
    price: 4000.00,
    category: 'Panchakarma',
    benefits: ['Treats skin diseases', 'Reduces chronic fever', 'Improves digestive disorders', 'Cleanses liver', 'Enhances metabolism'],
    procedures: ['Preparation with ghee intake', 'Herbal purgative administration', 'Monitoring of bowel movements', 'Rehydration therapy', 'Post-treatment diet plan'],
    contraindications: ['Pregnancy', 'Severe weakness', 'Rectal bleeding', 'Inflammatory conditions', 'Dehydration'],
    expected_benefits: ['Improved liver function', 'Clear skin', 'Better metabolism', 'Enhanced digestion'],
    doctorEmail: 'rajesh.kumar@niramay.com'
  },
  {
    name: 'Raktamokshana',
    description: 'Bloodletting therapy to remove impure blood and toxins, treating various blood-related disorders. Performed using leeches or specialized techniques by experienced practitioners.',
    duration: '75 minutes',
    price: 4500.00,
    category: 'Panchakarma',
    benefits: ['Treats skin diseases', 'Relieves gout and varicose veins', 'Reduces hypertension', 'Purifies blood', 'Decreases inflammation'],
    procedures: ['Site preparation and sterilization', 'Leech therapy or controlled bloodletting', 'Monitoring blood flow', 'Post-procedure wound care', 'Follow-up assessment'],
    contraindications: ['Anemia', 'Pregnancy', 'Bleeding disorders', 'Severe weakness', 'Blood-thinning medication'],
    expected_benefits: ['Purified blood', 'Reduced skin problems', 'Lower blood pressure', 'Decreased joint inflammation'],
    doctorEmail: 'lakshmi.iyer@niramay.com'
  }
];

async function addPanchakarmaTherapies() {
  let connection;
  
  try {
    console.log('🏥 Adding Panchakarma Therapies...\n');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'panchakarma_db'
    });

    console.log('✅ Connected to database\n');

    // Clear existing therapies first
    await connection.execute('DELETE FROM therapies');
    console.log('🗑️  Cleared old therapies\n');

    // Insert Panchakarma therapies
    for (const therapy of panchakarmaTherapies) {
      // Get doctor ID
      const [doctors] = await connection.execute(
        'SELECT id FROM users WHERE email = ? AND role = "doctor"',
        [therapy.doctorEmail]
      );
      
      const doctorId = doctors.length > 0 ? doctors[0].id : null;

      const [result] = await connection.execute(
        `INSERT INTO therapies 
        (name, description, duration, price, category, benefits, procedures, 
         contraindications, expected_benefits, availability) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          therapy.name,
          therapy.description,
          therapy.duration,
          therapy.price,
          therapy.category,
          JSON.stringify(therapy.benefits),
          JSON.stringify(therapy.procedures),
          JSON.stringify(therapy.contraindications),
          JSON.stringify(therapy.expected_benefits)
        ]
      );

      const therapyId = result.insertId;
      const doctorName = doctors.length > 0 ? doctors[0].name : 'Not assigned';

      // Update doctor's specialization to match therapy
      if (doctorId) {
        await connection.execute(
          'UPDATE users SET specialization = ? WHERE id = ?',
          [`${therapy.name} Specialist`, doctorId]
        );
      }

      console.log(`✅ ${therapy.name} added successfully (ID: ${therapyId})`);
      console.log(`   ⏱️  Duration: ${therapy.duration}`);
      console.log(`   💰 Price: ₹${therapy.price}`);
      console.log(`   👨‍⚕️ Specialist Doctor: ${doctorName || 'Not assigned'}`);
      console.log(`   📋 Category: ${therapy.category}\n`);
    }

    console.log('🎉 All Panchakarma therapies added successfully!\n');

    // Display all therapies with assigned doctors
    const [therapies] = await connection.execute(
      `SELECT t.*, u.name as doctor_name, u.email as doctor_email 
       FROM therapies t
       LEFT JOIN users u ON u.specialization = CONCAT(t.name, ' Specialist') AND u.role = 'doctor'
       ORDER BY t.name`
    );
    
    console.log('📊 Current Panchakarma Treatments with Specialist Doctors:');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    therapies.forEach((therapy, index) => {
      console.log(`${index + 1}. ${therapy.name}`);
      console.log(`   Duration: ${therapy.duration} | Price: ₹${therapy.price}`);
      console.log(`   👨‍⚕️ Specialist: ${therapy.doctor_name || 'Not assigned'}`);
      console.log(`   📧 Email: ${therapy.doctor_email || 'N/A'}`);
      console.log(`   ${therapy.description.substring(0, 70)}...`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addPanchakarmaTherapies();
