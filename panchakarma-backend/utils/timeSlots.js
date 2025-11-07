// Time slot configuration
const TIME_SLOT_CONFIG = {
  START_HOUR: 9,    // 9 AM
  END_HOUR: 18,     // 6 PM
  INTERVAL: 30,     // 30 minutes
  LUNCH_BREAK: {
    start: '13:00',
    end: '14:00'
  }
};

/**
 * Generate all available time slots based on configuration
 * @returns {string[]} Array of time slots in HH:MM format
 */
function generateAllTimeSlots() {
  const slots = [];
  const { START_HOUR, END_HOUR, INTERVAL, LUNCH_BREAK } = TIME_SLOT_CONFIG;

  for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
    for (let minute = 0; minute < 60; minute += INTERVAL) {
      // Don't add slots after END_HOUR
      if (hour === END_HOUR && minute > 0) break;
      
      const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Skip lunch break slots
      if (timeSlot >= LUNCH_BREAK.start && timeSlot < LUNCH_BREAK.end) {
        continue;
      }
      
      slots.push(timeSlot);
    }
  }

  return slots;
}

/**
 * Get available time slots excluding booked ones
 * @param {string[]} bookedSlots - Array of already booked time slots
 * @returns {Object} Available and booked slots with metadata
 */
function getAvailableSlots(bookedSlots = []) {
  const allSlots = generateAllTimeSlots();
  const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

  return {
    availableSlots,
    bookedSlots,
    totalSlots: allSlots.length,
    availableCount: availableSlots.length,
    bookedCount: bookedSlots.length,
    config: TIME_SLOT_CONFIG
  };
}

/**
 * Format time slot for display (e.g., "09:00" -> "9:00 AM")
 * @param {string} timeSlot - Time in HH:MM format
 * @returns {string} Formatted time
 */
function formatTimeSlot(timeSlot) {
  const [hours, minutes] = timeSlot.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Group time slots by morning/afternoon/evening
 * @param {string[]} slots - Array of time slots
 * @returns {Object} Grouped slots
 */
function groupTimeSlotsByPeriod(slots) {
  return {
    morning: slots.filter(slot => {
      const hour = parseInt(slot.split(':')[0]);
      return hour >= 9 && hour < 12;
    }),
    afternoon: slots.filter(slot => {
      const hour = parseInt(slot.split(':')[0]);
      return hour >= 14 && hour < 17;
    }),
    evening: slots.filter(slot => {
      const hour = parseInt(slot.split(':')[0]);
      return hour >= 17 && hour <= 18;
    })
  };
}

/**
 * Check if a time slot is valid
 * @param {string} timeSlot - Time in HH:MM format
 * @returns {boolean} Whether the slot is valid
 */
function isValidTimeSlot(timeSlot) {
  const allSlots = generateAllTimeSlots();
  return allSlots.includes(timeSlot);
}

module.exports = {
  TIME_SLOT_CONFIG,
  generateAllTimeSlots,
  getAvailableSlots,
  formatTimeSlot,
  groupTimeSlotsByPeriod,
  isValidTimeSlot
};
