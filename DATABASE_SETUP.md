# 🗄️ MySQL Database Setup Guide

## ✅ Fixed Issue
Previously, user data was stored in memory and **disappeared after server restart**. Now with MySQL, all data is **permanently stored** in the database! 🎉

## 📋 Prerequisites

1. **Install MySQL** (if not installed)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP/WAMP which includes MySQL

2. **Start MySQL Server**
   - XAMPP: Open XAMPP Control Panel → Start MySQL
   - Windows Service: MySQL should auto-start
   - Command: `net start mysql` (as Administrator)

## 🚀 Setup Steps

### Step 1: Configure Database Credentials

Open `panchakarma-backend/.env` and update your MySQL password:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=panchakarma_db
DB_PORT=3306
```

**Important:** If you're using XAMPP, the default password is usually empty (blank).

### Step 2: Run Database Setup

Open terminal in `panchakarma-backend` folder and run:

```bash
cd panchakarma-backend
npm run setup-db
```

This will:
- ✅ Create `panchakarma_db` database
- ✅ Create all tables (users, appointments, therapies, etc.)
- ✅ Insert demo accounts (admin, doctors)
- ✅ Insert therapy data

### Step 3: Verify Setup

You should see:
```
🔧 Starting database setup...
✅ Connected to MySQL server
📋 Creating database and tables...
✅ Database schema created
🌱 Seeding initial data...
✅ Initial data seeded

🎉 Database setup completed successfully!

Demo Accounts:
  Admin: admin@niramay.com / admin123
  Doctor: doctor@niramay.com / doctor123
```

### Step 4: Start the Server

```bash
npm start
```

You should see:
```
🚀 Server is running on port 3002
✅ MySQL Database connected successfully!
```

## 🔐 Demo Accounts

After setup, these accounts will be available:

### Admin Account
- **Email:** admin@niramay.com
- **Password:** admin123

### Doctor Accounts
- **Email:** doctor@niramay.com
- **Password:** doctor123
- **Email:** doctor2@niramay.com
- **Password:** doctor123

### Patient Accounts
Create new patient accounts via the signup page!

## 📊 Database Tables

The setup creates these tables:

1. **users** - All user accounts (admin, doctors, patients)
2. **therapies** - Available treatments
3. **appointments** - Patient bookings
4. **therapy_sessions** - Individual therapy sessions
5. **notifications** - User notifications
6. **doctor_schedules** - Doctor availability

## 🛠️ Manual MySQL Setup (Alternative)

If you prefer to set up manually:

1. Open MySQL command line or phpMyAdmin
2. Run the SQL files in order:
   ```sql
   source C:/path/to/panchakarma-backend/database/schema.sql
   source C:/path/to/panchakarma-backend/database/seed.sql
   ```

## ❌ Troubleshooting

### Error: "ER_ACCESS_DENIED_ERROR"
**Problem:** Wrong MySQL password

**Solution:** 
1. Check your MySQL password
2. Update `DB_PASSWORD` in `.env` file
3. If using XAMPP with no password, leave it empty: `DB_PASSWORD=`

### Error: "ECONNREFUSED"
**Problem:** MySQL server not running

**Solution:**
1. Start MySQL service
2. XAMPP: Open Control Panel → Start MySQL
3. Windows: Run `net start mysql` as Administrator

### Error: "ER_BAD_DB_ERROR"
**Problem:** Database doesn't exist

**Solution:**
1. Run `npm run setup-db` to create database
2. Or manually create: `CREATE DATABASE panchakarma_db;`

### Error: "Client does not support authentication protocol"
**Problem:** MySQL 8+ authentication issue

**Solution:**
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

## 🔄 Reset Database

To start fresh:

```sql
DROP DATABASE panchakarma_db;
```

Then run setup again:
```bash
npm run setup-db
```

## 📝 Important Notes

- ⚠️ **Never commit `.env` file** - It contains your database password
- ✅ `.env.example` is safe to commit (no real passwords)
- 🔒 All passwords are hashed with bcrypt (secure)
- 💾 Data persists after server restart (that's the whole point!)

## 🎯 Benefits of MySQL

✅ **Persistent Data** - Users don't disappear after restart
✅ **Scalability** - Handle thousands of users
✅ **Relationships** - Link appointments to users and therapies
✅ **Transactions** - Data integrity guaranteed
✅ **Backup** - Easy to backup and restore data
✅ **Performance** - Fast queries with indexes

---

Need help? Check the main README.md or console logs for error messages.
