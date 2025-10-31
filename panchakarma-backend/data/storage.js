// In-memory data storage for development
// Replace with actual database in production

const bcrypt = require('bcryptjs');

// Pre-populate with admin and doctor accounts
const users = [
  {
    id: 1,
    name: 'Dr. Admin',
    email: 'admin@niramay.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    phone: '+91-9876543210',
    specialization: 'System Administration',
    experience: '10 years',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 2,
    name: 'Dr. Priya Sharma',
    email: 'doctor@niramay.com',
    password: bcrypt.hashSync('doctor123', 10),
    role: 'doctor',
    phone: '+91-9876543211',
    specialization: 'Panchakarma Specialist',
    experience: '8 years',
    qualifications: 'BAMS, MD (Ayurveda)',
    about: 'Experienced Ayurvedic doctor specializing in Panchakarma treatments and detoxification therapies.',
    status: 'active',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  },
  {
    id: 3,
    name: 'Dr. Rajesh Kumar',
    email: 'doctor2@niramay.com',
    password: bcrypt.hashSync('doctor123', 10),
    role: 'doctor',
    phone: '+91-9876543212',
    specialization: 'Ayurvedic Medicine',
    experience: '12 years',
    qualifications: 'BAMS, PhD (Ayurveda)',
    about: 'Senior consultant with expertise in traditional Ayurvedic treatments and wellness programs.',
    status: 'active',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03')
  }
];
const appointments = [];
const therapies = [
  {
    id: 1,
    name: 'Panchakarma Detox',
    description: 'Complete body detoxification through traditional Panchakarma methods',
    duration: '14 days',
    price: 25000,
    benefits: ['Complete detox', 'Improved immunity', 'Mental clarity', 'Weight management'],
    procedures: ['Abhyanga', 'Swedana', 'Virechana', 'Basti', 'Nasya'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3',
    category: 'Detox',
    availability: true
  },
  {
    id: 2,
    name: 'Abhyanga Massage',
    description: 'Full body oil massage using warm herbal oils',
    duration: '90 minutes',
    price: 2500,
    benefits: ['Stress relief', 'Improved circulation', 'Muscle relaxation', 'Skin nourishment'],
    procedures: ['Oil massage', 'Steam therapy'],
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3',
    category: 'Massage',
    availability: true
  },
  {
    id: 3,
    name: 'Shirodhara',
    description: 'Continuous pouring of warm oil on the forehead for deep relaxation',
    duration: '60 minutes',
    price: 3500,
    benefits: ['Stress relief', 'Better sleep', 'Mental peace', 'Hair health'],
    procedures: ['Oil pouring', 'Head massage'],
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3',
    category: 'Therapy',
    availability: true
  },
  {
    id: 4,
    name: 'Ayurvedic Consultation',
    description: 'Personalized consultation with experienced Ayurvedic doctors',
    duration: '45 minutes',
    price: 1500,
    benefits: ['Personalized treatment', 'Diet planning', 'Lifestyle guidance', 'Health assessment'],
    procedures: ['Consultation', 'Pulse diagnosis', 'Treatment planning'],
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3',
    category: 'Consultation',
    availability: true
  }
];
const notifications = [];
const therapySessions = [];
const doctorSchedules = [];

module.exports = {
  users,
  appointments,
  therapies,
  notifications,
  therapySessions,
  doctorSchedules
};