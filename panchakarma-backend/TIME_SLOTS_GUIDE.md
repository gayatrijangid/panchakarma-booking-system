# Time Slot Selection Guide

## Overview
The booking system includes a comprehensive time slot management system that allows patients to view available times and book appointments at their convenience.

---

## Time Slot Configuration

### Business Hours
- **Start Time:** 9:00 AM
- **End Time:** 6:00 PM
- **Interval:** 30 minutes
- **Lunch Break:** 1:00 PM - 2:00 PM (slots unavailable)

### Available Time Slots
```
Morning (9:00 AM - 12:00 PM):
09:00, 09:30, 10:00, 10:30, 11:00, 11:30, 12:00

Afternoon (2:00 PM - 5:00 PM):
14:00, 14:30, 15:00, 15:30, 16:00, 16:30

Evening (5:00 PM - 6:00 PM):
17:00, 17:30, 18:00
```

**Total:** 19 time slots per day

---

## API Usage

### 1. Get Available Time Slots (Basic)

**Endpoint:** `GET /api/appointments/slots/available`

**Query Parameters:**
- `date` (required): Date in YYYY-MM-DD format
- `doctorId` (optional): Filter by specific doctor

**Example Request:**
```
GET /api/appointments/slots/available?date=2025-11-10
```

**Example Response:**
```json
{
  "date": "2025-11-10",
  "availableSlots": [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "16:00", "17:00"
  ],
  "bookedSlots": [
    "12:00", "15:30", "16:30", "17:30"
  ],
  "totalSlots": 19,
  "availableCount": 11,
  "bookedCount": 4,
  "config": {
    "START_HOUR": 9,
    "END_HOUR": 18,
    "INTERVAL": 30,
    "LUNCH_BREAK": {
      "start": "13:00",
      "end": "14:00"
    }
  }
}
```

---

### 2. Get Grouped Time Slots

**Endpoint:** `GET /api/appointments/slots/available?grouped=true`

**Example Request:**
```
GET /api/appointments/slots/available?date=2025-11-10&grouped=true
```

**Example Response:**
```json
{
  "date": "2025-11-10",
  "grouped": {
    "morning": {
      "available": ["09:00", "09:30", "10:00", "10:30", "11:00"],
      "booked": ["11:30", "12:00"],
      "label": "Morning (9:00 AM - 12:00 PM)"
    },
    "afternoon": {
      "available": ["14:00", "14:30", "15:00", "16:00"],
      "booked": ["15:30", "16:30"],
      "label": "Afternoon (2:00 PM - 5:00 PM)"
    },
    "evening": {
      "available": ["17:00"],
      "booked": ["17:30", "18:00"],
      "label": "Evening (5:00 PM - 6:00 PM)"
    }
  },
  "availableSlots": [...],
  "bookedSlots": [...],
  "totalSlots": 19,
  "availableCount": 10,
  "bookedCount": 6
}
```

---

### 3. Filter by Specific Doctor

**Example Request:**
```
GET /api/appointments/slots/available?date=2025-11-10&doctorId=2
```

This will show only the slots available for doctor with ID 2.

---

## Booking with Time Slot

### Create Appointment

**Endpoint:** `POST /api/appointments`

**Body:**
```json
{
  "therapyId": 1,
  "appointmentDate": "2025-11-10",
  "appointmentTime": "10:00",
  "doctorId": 2,
  "notes": "First visit"
}
```

### Validation Rules

✅ **Time slot must be valid:**
- Must be in HH:MM format (e.g., "10:00", "14:30")
- Must be within business hours (9:00 AM - 6:00 PM)
- Must be at 30-minute intervals
- Cannot be during lunch break (1:00 PM - 2:00 PM)

✅ **Date must be valid:**
- Cannot be in the past
- Must be in YYYY-MM-DD format

✅ **Slot must be available:**
- Cannot book if time slot is already taken by another appointment

### Error Responses

**Invalid Time Slot:**
```json
{
  "message": "Invalid time slot. Please select a valid time from available slots.",
  "hint": "Use GET /api/appointments/slots/available?date=YYYY-MM-DD to see available times"
}
```

**Past Date:**
```json
{
  "message": "Cannot book appointments in the past"
}
```

**Slot Already Booked:**
```json
{
  "message": "This time slot is already booked"
}
```

---

## Frontend Implementation Guide

### Step 1: Fetch Available Slots

```javascript
// Fetch available slots for a specific date
async function getAvailableSlots(date, doctorId = null) {
  const params = new URLSearchParams({ date });
  if (doctorId) params.append('doctorId', doctorId);
  
  const response = await fetch(
    `/api/appointments/slots/available?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  return response.json();
}
```

### Step 2: Display Time Slots

**Option A: Flat List**
```javascript
const slots = await getAvailableSlots('2025-11-10');

// Display available slots
slots.availableSlots.forEach(time => {
  console.log(`✅ ${time} - Available`);
});

// Display booked slots
slots.bookedSlots.forEach(time => {
  console.log(`❌ ${time} - Booked`);
});
```

**Option B: Grouped by Period**
```javascript
const slots = await getAvailableSlots('2025-11-10', null, true);

// Morning slots
console.log(slots.grouped.morning.label);
slots.grouped.morning.available.forEach(time => {
  console.log(`  ✅ ${time}`);
});

// Afternoon slots
console.log(slots.grouped.afternoon.label);
slots.grouped.afternoon.available.forEach(time => {
  console.log(`  ✅ ${time}`);
});

// Evening slots
console.log(slots.grouped.evening.label);
slots.grouped.evening.available.forEach(time => {
  console.log(`  ✅ ${time}`);
});
```

### Step 3: Book Appointment

```javascript
async function bookAppointment(therapyId, date, time, doctorId) {
  const response = await fetch('/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      therapyId,
      appointmentDate: date,
      appointmentTime: time,
      doctorId
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return response.json();
}
```

---

## UI/UX Recommendations

### Time Picker Display

**Recommended Layout:**

```
┌─────────────────────────────────────┐
│  Select Date: [2025-11-10]         │
│  Select Doctor: [Dr. Smith]        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  🌅 Morning (9:00 AM - 12:00 PM)   │
├─────────────────────────────────────┤
│  ✅ 09:00  ✅ 09:30  ✅ 10:00      │
│  ✅ 10:30  ✅ 11:00  ❌ 11:30      │
│  ❌ 12:00                           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  🌤️ Afternoon (2:00 PM - 5:00 PM) │
├─────────────────────────────────────┤
│  ✅ 14:00  ✅ 14:30  ✅ 15:00      │
│  ❌ 15:30  ✅ 16:00  ❌ 16:30      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  🌆 Evening (5:00 PM - 6:00 PM)    │
├─────────────────────────────────────┤
│  ✅ 17:00  ❌ 17:30  ❌ 18:00      │
└─────────────────────────────────────┘

[Book Appointment]
```

### Visual Indicators

- ✅ **Available:** Green background, clickable
- ❌ **Booked:** Gray background, disabled
- 🕐 **Selected:** Blue background with checkmark
- ⏰ **Current time:** Highlight if booking for today

---

## Example Workflows

### Patient Booking Flow

1. **Select Date:**
   ```
   User selects: November 10, 2025
   ```

2. **View Available Times:**
   ```
   GET /api/appointments/slots/available?date=2025-11-10
   
   Shows: 11 available slots
   ```

3. **Select Time:**
   ```
   User clicks: 10:00 AM
   ```

4. **Book Appointment:**
   ```
   POST /api/appointments
   {
     "therapyId": 1,
     "appointmentDate": "2025-11-10",
     "appointmentTime": "10:00",
     "notes": "First consultation"
   }
   ```

5. **Confirmation:**
   ```
   ✅ Appointment booked successfully!
   
   Details:
   - Date: November 10, 2025
   - Time: 10:00 AM
   - Therapy: Panchakarma Detox
   - Status: Pending approval
   ```

---

## Customization

To modify time slot settings, edit `/utils/timeSlots.js`:

```javascript
const TIME_SLOT_CONFIG = {
  START_HOUR: 9,     // Change start time
  END_HOUR: 18,      // Change end time
  INTERVAL: 30,      // Change interval (15, 30, or 60 minutes)
  LUNCH_BREAK: {
    start: '13:00',  // Lunch break start
    end: '14:00'     // Lunch break end
  }
};
```

**Examples:**

**15-minute intervals:**
```javascript
INTERVAL: 15  // Creates: 09:00, 09:15, 09:30, 09:45, etc.
```

**Extended hours:**
```javascript
START_HOUR: 8   // Start at 8:00 AM
END_HOUR: 20    // End at 8:00 PM
```

**No lunch break:**
```javascript
LUNCH_BREAK: {
  start: null,
  end: null
}
```

---

## Summary

✅ **30-minute time slots** from 9 AM to 6 PM
✅ **Automatic lunch break** exclusion
✅ **Real-time availability** checking
✅ **Grouped time periods** (Morning/Afternoon/Evening)
✅ **Doctor-specific** filtering
✅ **Past date prevention**
✅ **Double-booking prevention**
✅ **Easy customization** via configuration file

The system ensures patients can easily select from available time slots while preventing scheduling conflicts!
