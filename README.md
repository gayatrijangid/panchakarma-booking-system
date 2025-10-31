# 🌿 Panchakarma Booking System

A comprehensive web application for managing Ayurvedic Panchakarma treatments, appointments, and patient care.

## ✨ Features

- **User Authentication** - Secure login and signup with JWT
- **Role-Based Access** - Admin, Doctor, and Patient dashboards
- **Appointment Management** - Book and manage therapy sessions
- **WhatsApp Notifications** - Automated appointment reminders
- **Therapy Catalog** - Browse Ayurvedic treatments
- **Profile Management** - User profiles with medical history

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd C:\Users\Admin\new_web\panchakarma-booking-system
   ```

2. **Install Backend Dependencies**
   ```bash
   cd panchakarma-backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../panchakarma-react
   npm install
   ```

### Running the Application

#### Option 1: Using PowerShell Script (Recommended)
Double-click `start-servers.ps1` or run in PowerShell:
```powershell
.\start-servers.ps1
```

#### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd panchakarma-backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd panchakarma-react
npm start
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3002

## 🔐 Demo Credentials

### Admin Account
- **Email:** admin@niramay.com
- **Password:** admin123

### Doctor Account
- **Email:** doctor@niramay.com
- **Password:** doctor123

### Patient Account
You can create a new patient account via the signup page.

## 📁 Project Structure

```
panchakarma-booking-system/
├── panchakarma-backend/     # Express.js backend
│   ├── routes/              # API routes
│   ├── data/                # In-memory data storage
│   └── index.js             # Backend entry point
├── panchakarma-react/       # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # Context providers
│   │   ├── services/        # API services
│   │   └── pages/           # Page components
│   └── public/
└── start-servers.ps1        # Server startup script
```

## 🛠️ Technology Stack

### Backend
- Express.js
- JWT Authentication
- bcryptjs for password hashing
- In-memory data storage (development)

### Frontend
- React 18
- React Router for navigation
- Styled Components for styling
- Axios for API calls
- Lucide React for icons
- React Hot Toast for notifications

## 🔧 Configuration

### Backend (.env)
```
PORT=3002
JWT_SECRET=panchakarma-super-secret-key-123456789
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3002/api
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Therapies
- `GET /api/therapies` - Get all therapies
- `GET /api/therapies/:id` - Get therapy details

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user profile

## 🐛 Troubleshooting

### Authentication Errors

If you're getting "Login Failed" or "Register Failed" errors:

1. **Make sure the backend server is running:**
   ```bash
   cd panchakarma-backend
   npm start
   ```
   You should see: `🚀 Server is running on port 3002`

2. **Check if port 3002 is accessible:**
   Open http://localhost:3002/api/health in your browser

3. **Clear browser storage:**
   - Open Developer Tools (F12)
   - Go to Application/Storage tab
   - Clear Local Storage
   - Refresh the page

4. **Check console for errors:**
   - Open Developer Tools (F12)
   - Check Console tab for error messages

### Common Issues

**Issue:** Backend won't start
- Make sure no other process is using port 3002
- Check that all dependencies are installed: `npm install`

**Issue:** Frontend can't connect to backend
- Verify `.env` file exists in `panchakarma-react` folder
- Check CORS settings in backend `index.js`

**Issue:** Login works but gives 401 errors on other pages
- JWT token might be expired or invalid
- Clear local storage and login again

## 📧 Support

For issues or questions, please check:
1. Console logs in browser (F12)
2. Backend terminal for error messages
3. Network tab in Developer Tools

## 📄 License

This project is for educational purposes.

---

Made with 🌿 by Niramay Team
