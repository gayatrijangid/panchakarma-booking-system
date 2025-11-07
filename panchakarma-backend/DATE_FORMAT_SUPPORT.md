# Date Format Support

## Overview
The API now supports **multiple date formats** automatically. The backend will normalize any common date format to the standard YYYY-MM-DD format used by the database.

---

## Supported Date Formats

✅ **YYYY-MM-DD** (ISO format)
```
2025-11-22
```

✅ **DD-MM-YYYY** (European format)
```
22-11-2025
```

✅ **DD/MM/YYYY** (European with slashes)
```
22/11/2025
```

✅ **MM/DD/YYYY** (American format)
```
11/22/2025
```

---

## How It Works

The backend automatically detects and converts the date format:

```javascript
// Input: 22-11-2025 (DD-MM-YYYY)
// Normalized: 2025-11-22 (YYYY-MM-DD)
// Stored in DB: 2025-11-22
```

---

## API Examples

### Get Available Slots

**All these formats work:**

```bash
# European format (DD-MM-YYYY)
GET /api/appointments/slots/available?date=22-11-2025

# ISO format (YYYY-MM-DD)
GET /api/appointments/slots/available?date=2025-11-22

# With slashes (DD/MM/YYYY)
GET /api/appointments/slots/available?date=22/11/2025
```

**Response:**
```json
{
  "date": "2025-11-22",  // Always returned in YYYY-MM-DD
  "availableSlots": ["09:00", "09:30", "10:00", ...],
  "totalSlots": 17,
  "availableCount": 17
}
```

---

### Create Appointment

**All these formats work:**

```json
// European format
{
  "therapyId": 1,
  "appointmentDate": "22-11-2025",
  "appointmentTime": "10:00"
}

// ISO format
{
  "therapyId": 1,
  "appointmentDate": "2025-11-22",
  "appointmentTime": "10:00"
}

// With slashes
{
  "therapyId": 1,
  "appointmentDate": "22/11/2025",
  "appointmentTime": "10:00"
}
```

---

## Frontend Implementation

### JavaScript/React Example

```javascript
// The frontend can send dates in any format
const bookAppointment = async (therapyId, date, time) => {
  // Date can be in DD-MM-YYYY or YYYY-MM-DD
  const response = await fetch('/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      therapyId,
      appointmentDate: date,  // Backend will normalize
      appointmentTime: time
    })
  });
  
  return response.json();
};

// Usage
await bookAppointment(1, '22-11-2025', '10:00'); // ✅ Works
await bookAppointment(1, '2025-11-22', '10:00'); // ✅ Works
```

### Date Picker Integration

```javascript
// If using a date picker that returns DD-MM-YYYY
const DatePicker = () => {
  const [selectedDate, setSelectedDate] = useState('');
  
  const handleDateChange = (date) => {
    // Date picker returns: 22-11-2025
    setSelectedDate(date);
    
    // Fetch available slots - backend handles format conversion
    fetchSlots(date);
  };
  
  return (
    <input 
      type="date" 
      onChange={(e) => handleDateChange(e.target.value)}
    />
  );
};
```

---

## Error Handling

### Invalid Date Format

If the date cannot be parsed:

```json
{
  "message": "Invalid date format",
  "hint": "Use YYYY-MM-DD, DD-MM-YYYY, or DD/MM/YYYY format"
}
```

### Past Date

```json
{
  "message": "Cannot book appointments in the past"
}
```

---

## Response Format

**All API responses return dates in ISO format (YYYY-MM-DD):**

```json
{
  "appointment": {
    "id": 1,
    "appointment_date": "2025-11-22",  // Always YYYY-MM-DD
    "appointment_time": "10:00:00",
    "status": "pending"
  }
}
```

---

## Implementation Details

### Date Helper Functions

Located in `utils/dateHelper.js`:

- `normalizeDate(dateString)` - Convert any format to YYYY-MM-DD
- `isDateInPast(dateString)` - Check if date is in the past
- `formatDateForDisplay(dateString)` - Convert to DD-MM-YYYY for display
- `getTodayDate()` - Get today's date in YYYY-MM-DD

### Where It's Used

1. **Create Appointment** - `POST /api/appointments`
2. **Update Appointment** - `PUT /api/appointments/:id`
3. **Get Available Slots** - `GET /api/appointments/slots/available`
4. **Filter Appointments** - `GET /api/appointments?date=...`

---

## Best Practices

### Frontend

1. **Use native date pickers** - They handle formatting automatically
2. **Display dates in user's locale** - Convert for display purposes
3. **Send in any format** - Backend handles normalization
4. **Store in YYYY-MM-DD** - For consistency

### Backend

1. **Always normalize incoming dates** - Use `normalizeDate()`
2. **Store in YYYY-MM-DD** - Database standard
3. **Validate after normalization** - Check if valid and not in past
4. **Return in YYYY-MM-DD** - For consistency

---

## Testing

### Test Different Formats

```bash
# Test DD-MM-YYYY
curl -X GET "http://localhost:3002/api/appointments/slots/available?date=22-11-2025" \
  -H "Authorization: Bearer $TOKEN"

# Test YYYY-MM-DD
curl -X GET "http://localhost:3002/api/appointments/slots/available?date=2025-11-22" \
  -H "Authorization: Bearer $TOKEN"

# Test DD/MM/YYYY
curl -X GET "http://localhost:3002/api/appointments/slots/available?date=22/11/2025" \
  -H "Authorization: Bearer $TOKEN"
```

All should return the same result with `"date": "2025-11-22"`.

---

## Summary

✅ **Multiple formats accepted** - DD-MM-YYYY, YYYY-MM-DD, DD/MM/YYYY
✅ **Automatic conversion** - Backend normalizes all formats
✅ **Consistent responses** - Always returns YYYY-MM-DD
✅ **Past date validation** - Prevents booking in the past
✅ **Easy frontend integration** - No format conversion needed

The date format handling makes it easy for frontend developers to work with dates in their preferred format while maintaining consistency in the backend!
