// Constants and type definitions for the Panchakarma Management System

// User roles
export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin'
};

// Appointment statuses
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  RESCHEDULED: 'rescheduled'
};

// Notification types
export const NOTIFICATION_TYPES = {
  APPOINTMENT: 'appointment',
  REMINDER: 'reminder',
  PRECAUTION: 'precaution',
  SYSTEM: 'system'
};

// Notification channels
export const NOTIFICATION_CHANNELS = {
  IN_APP: 'in-app',
  EMAIL: 'email',
  SMS: 'sms'
};

// Therapy categories
export const THERAPY_CATEGORIES = {
  PANCHAKARMA: 'panchakarma',
  SUPPORTIVE: 'supportive',
  REJUVENATIVE: 'rejuvenative'
};

// Session statuses
export const SESSION_STATUS = {
  COMPLETED: 'completed',
  MISSED: 'missed',
  RESCHEDULED: 'rescheduled'
};

// Milestone statuses
export const MILESTONE_STATUS = {
  PENDING: 'pending',
  ACHIEVED: 'achieved',
  OVERDUE: 'overdue'
};

// Notification statuses
export const NOTIFICATION_STATUS = {
  PENDING: 'pending',
  SENT: 'sent',
  READ: 'read'
};

// Default therapy data
export const DEFAULT_THERAPIES = [
  {
    id: '1',
    name: 'Vamana',
    description: 'Therapeutic emesis to eliminate toxins from the upper body',
    duration: 120,
    precautions: {
      pre: [
        'Fast for 12 hours before treatment',
        'Avoid heavy meals 3 days prior',
        'Stay hydrated but limit water intake 2 hours before'
      ],
      post: [
        'Rest for 24 hours',
        'Consume only light, warm foods',
        'Avoid cold drinks and foods for 3 days'
      ]
    },
    contraindications: ['Pregnancy', 'Heart conditions', 'Severe weakness'],
    benefits: ['Respiratory health', 'Weight management', 'Kapha balance'],
    category: THERAPY_CATEGORIES.PANCHAKARMA
  },
  {
    id: '2',
    name: 'Virechana',
    description: 'Purification through controlled purgation',
    duration: 90,
    precautions: {
      pre: [
        'Follow preparatory diet for 3-7 days',
        'Take prescribed medications as directed',
        'Ensure proper hydration'
      ],
      post: [
        'Maintain strict dietary regimen',
        'Avoid physical exertion for 3 days',
        'Stay in warm environment'
      ]
    },
    contraindications: ['Severe dehydration', 'Pregnancy', 'Acute illness'],
    benefits: ['Liver detox', 'Skin health', 'Pitta balance'],
    category: THERAPY_CATEGORIES.PANCHAKARMA
  },
  {
    id: '3',
    name: 'Basti',
    description: 'Medicated enema therapy',
    duration: 60,
    precautions: {
      pre: [
        'Empty bowels naturally if possible',
        'Inform about any allergies',
        'Wear comfortable clothing'
      ],
      post: [
        'Rest for 1 hour minimum',
        'Avoid immediate bathing',
        'Monitor for any adverse reactions'
      ]
    },
    contraindications: ['Rectal bleeding', 'Severe hemorrhoids', 'Recent abdominal surgery'],
    benefits: ['Joint health', 'Nervous system', 'Vata balance'],
    category: THERAPY_CATEGORIES.PANCHAKARMA
  },
  {
    id: '4',
    name: 'Nasya',
    description: 'Nasal therapy with medicated oils',
    duration: 45,
    precautions: {
      pre: [
        'Clean nasal passages gently',
        'Inform about nasal allergies or conditions',
        'Avoid eating 1 hour before'
      ],
      post: [
        'Rest with head elevated for 30 minutes',
        'Avoid exposure to cold air',
        'Do not blow nose forcefully'
      ]
    },
    contraindications: ['Acute sinusitis', 'Nasal injuries', 'Severe cold'],
    benefits: ['Improved breathing', 'Mental clarity', 'Sinus health'],
    category: THERAPY_CATEGORIES.PANCHAKARMA
  },
  {
    id: '5',
    name: 'Raktamokshana',
    description: 'Blood purification therapy',
    duration: 75,
    precautions: {
      pre: [
        'Blood tests as prescribed',
        'Inform about blood disorders',
        'Light breakfast allowed'
      ],
      post: [
        'Apply pressure on puncture sites',
        'Increase fluid intake',
        'Avoid strenuous activity for 24 hours'
      ]
    },
    contraindications: ['Anemia', 'Blood clotting disorders', 'Pregnancy'],
    benefits: ['Skin disorders', 'Blood purification', 'Improved circulation'],
    category: THERAPY_CATEGORIES.PANCHAKARMA
  }
];