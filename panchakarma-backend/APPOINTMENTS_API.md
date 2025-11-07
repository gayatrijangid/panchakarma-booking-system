# Appointments API Documentation

## Overview
Complete CRUD operations for managing appointments with role-based permissions.

## Authentication
All endpoints require JWT token in Authorization header: `Bearer <token>`

---

## Endpoints

### 1. Create Appointment
**POST** `/api/appointments`

**Role:** Patient (any authenticated user)

**Body:**
```json
{
  "therapyId": 1,
  "appointmentDate": "2025-11-10",
  "appointmentTime": "10:00",
  "doctorId": 2,  // optional
  "notes": "Special requirements"  // optional
}
```

**Response:**
```json
{
  "message": "Appointment booked successfully",
  "appointment": { ...appointment details... }
}
```

---

### 2. Get Patient's Own Appointments
**GET** `/api/appointments/my-appointments?status=all&page=1&limit=10`

**Role:** Patient

**Query Parameters:**
- `status`: `all`, `pending`, `confirmed`, `completed`, `cancelled`
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response:**
```json
{
  "appointments": [...],
  "total": 25,
  "page": 1,
  "totalPages": 3
}
```

---

### 3. Get All Appointments (Doctor/Admin)
**GET** `/api/appointments?status=pending&date=2025-11-10&page=1&limit=10`

**Role:** Doctor, Admin

**Query Parameters:**
- `status`: Filter by status
- `therapyId`: Filter by therapy
- `date`: Filter by date (YYYY-MM-DD)
- `page`: Page number
- `limit`: Items per page

**Note:** Doctors only see their own appointments or unassigned ones.

---

### 4. Get Single Appointment Details
**GET** `/api/appointments/:appointmentId`

**Role:** Patient (own), Doctor (assigned), Admin

**Response:**
```json
{
  "appointment": {
    "id": 1,
    "patient_name": "John Doe",
    "doctor_name": "Dr. Smith",
    "therapy_name": "Panchakarma Detox",
    "appointment_date": "2025-11-10",
    "appointment_time": "10:00:00",
    "status": "pending",
    "notes": "..."
  }
}
```

---

### 5. Update Appointment Date/Time
**PUT** `/api/appointments/:appointmentId`

**Role:** Patient (own), Doctor (assigned), Admin

**Body:**
```json
{
  "appointmentDate": "2025-11-12",  // optional
  "appointmentTime": "14:00",        // optional
  "notes": "Updated notes"           // optional
}
```

**Features:**
- ✅ Checks slot availability before updating
- ✅ Prevents double booking
- ✅ Both patient and doctor can reschedule

---

### 6. Update Appointment Status (Approve/Reject/Complete)
**PUT** `/api/appointments/:appointmentId/status`

**Role:** 
- Patient: Can only cancel own appointments
- Doctor: Can update assigned appointments
- Admin: Can update any appointment

**Body:**
```json
{
  "status": "confirmed"  // pending, confirmed, completed, cancelled
}
```

**Response:**
```json
{
  "message": "Appointment confirmed successfully",
  "appointment": { ...updated details... }
}
```

---

### 7. Assign Doctor to Appointment
**PUT** `/api/appointments/:appointmentId/assign-doctor`

**Role:** Admin only

**Body:**
```json
{
  "doctorId": 2
}
```

**Effect:** 
- Assigns doctor
- Automatically sets status to "confirmed"

---

### 8. Delete/Cancel Appointment
**DELETE** `/api/appointments/:appointmentId`

**Role:** Patient (own), Doctor (assigned), Admin

**Note:** Soft delete - sets status to 'cancelled' instead of removing from database

---

### 9. Get Available Time Slots
**GET** `/api/appointments/slots/available?date=2025-11-10&doctorId=2`

**Role:** Any authenticated user

**Query Parameters:**
- `date`: Required (YYYY-MM-DD)
- `doctorId`: Optional

**Response:**
```json
{
  "date": "2025-11-10",
  "availableSlots": ["09:00", "11:00", "14:00", "15:00"],
  "bookedSlots": ["10:00", "12:00", "13:00"]
}
```

---

## Workflow Examples

### Patient Workflow
1. **Book Appointment:**
   - POST `/api/appointments` with therapy details
   - Appointment created with status "pending"

2. **View Bookings:**
   - GET `/api/appointments/my-appointments`
   - See all their appointments

3. **Reschedule:**
   - PUT `/api/appointments/:id` with new date/time
   - System checks availability

4. **Cancel:**
   - DELETE `/api/appointments/:id`
   - Status changes to "cancelled"

### Doctor Workflow
1. **View Assigned Appointments:**
   - GET `/api/appointments?status=confirmed`
   - See only their appointments

2. **Accept/Reject Pending:**
   - PUT `/api/appointments/:id/status` → "confirmed" or "cancelled"

3. **Reschedule Patient:**
   - PUT `/api/appointments/:id` with new time

4. **Mark Complete:**
   - PUT `/api/appointments/:id/status` → "completed"

### Admin Workflow
1. **View All Appointments:**
   - GET `/api/appointments`

2. **Assign Doctor:**
   - PUT `/api/appointments/:id/assign-doctor`

3. **Manage Any Appointment:**
   - Full control over all appointments

---

## Status Flow

```
pending → confirmed → completed
   ↓          ↓          ↓
cancelled ← cancelled ← cancelled
```

- **pending**: New booking, awaiting approval
- **confirmed**: Doctor/Admin approved
- **completed**: Treatment finished
- **cancelled**: Cancelled by any party

---

## Permissions Summary

| Action | Patient | Doctor | Admin |
|--------|---------|--------|-------|
| Create | ✅ Own | ❌ | ❌ |
| View Own | ✅ | ✅ | ✅ |
| View All | ❌ | ✅ (assigned only) | ✅ |
| Update Date/Time | ✅ Own | ✅ Assigned | ✅ |
| Approve/Reject | ❌ | ✅ Assigned | ✅ |
| Assign Doctor | ❌ | ❌ | ✅ |
| Cancel | ✅ Own | ✅ Assigned | ✅ |

---

## Database Schema

```sql
CREATE TABLE appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  doctor_id INT,
  therapy_id INT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled'),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## Features Implemented

✅ **For Patients:**
- Book appointments
- View their bookings
- Reschedule appointments
- Cancel appointments

✅ **For Doctors:**
- View assigned appointments
- Approve/reject appointments
- Reschedule patient appointments
- Mark appointments as completed

✅ **For Admins:**
- View all appointments
- Assign doctors to appointments
- Full CRUD on all appointments

✅ **Additional Features:**
- Conflict detection (prevent double booking)
- Available slots checking
- Role-based access control
- Pagination support
- Status filtering
