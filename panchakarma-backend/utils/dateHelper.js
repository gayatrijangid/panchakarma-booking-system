/**
 * Convert various date formats to YYYY-MM-DD format
 * @param {string} dateString - Date in any common format
 * @returns {string} Date in YYYY-MM-DD format
 */
function normalizeDate(dateString) {
  if (!dateString) return null;

  // Remove any whitespace
  dateString = dateString.trim();

  // Check if already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  // Handle DD-MM-YYYY format
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  }

  // Handle DD/MM/YYYY format
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Handle MM/DD/YYYY format (American)
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  }

  // Try parsing as ISO date
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }

  // If all else fails, return original
  return dateString;
}

/**
 * Format date as DD-MM-YYYY for display
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Date in DD-MM-YYYY format
 */
function formatDateForDisplay(dateString) {
  if (!dateString) return '';
  
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`;
}

/**
 * Check if date is valid
 * @param {string} dateString - Date string
 * @returns {boolean} Whether date is valid
 */
function isValidDate(dateString) {
  const normalized = normalizeDate(dateString);
  const date = new Date(normalized);
  return !isNaN(date.getTime());
}

/**
 * Check if date is in the past
 * @param {string} dateString - Date string
 * @returns {boolean} Whether date is in the past
 */
function isDateInPast(dateString) {
  const normalized = normalizeDate(dateString);
  const date = new Date(normalized);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

module.exports = {
  normalizeDate,
  formatDateForDisplay,
  isValidDate,
  isDateInPast,
  getTodayDate
};
