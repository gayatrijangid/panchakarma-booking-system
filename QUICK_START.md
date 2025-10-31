# 🚀 Quick Start - Fix Login/Signup Issue

## ⚡ The Problem
Users disappear after restarting the server because data was stored in memory.

## ✅ The Solution
Set up MySQL database for permanent storage!

---

## 📝 Step-by-Step (5 Minutes)

### 1️⃣ Make sure MySQL is running
- **XAMPP users:** Open XAMPP → Start MySQL
- **Others:** MySQL should be running by default

### 2️⃣ Configure your password
Open `panchakarma-backend/.env` and set your MySQL password:
```env
DB_PASSWORD=YOUR_MYSQL_PASSWORD
```
**XAMPP users:** Usually leave it empty: `DB_PASSWORD=`

### 3️⃣ Setup the database
```bash
cd panchakarma-backend
npm run setup-db
```

Wait for "✅ Database setup completed successfully!"

### 4️⃣ Start the backend
```bash
npm start
```

Look for "✅ MySQL Database connected successfully!"

### 5️⃣ Start the frontend (new terminal)
```bash
cd panchakarma-react
npm start
```

---

## ✨ That's It!

Now your users will **persist forever**! 🎉

**Test it:**
1. Sign up a new user
2. Close/restart the server
3. Login with the same credentials ✅

---

## 🔐 Demo Accounts

- **Admin:** admin@niramay.com / admin123
- **Doctor:** doctor@niramay.com / doctor123

---

## ❌ Troubleshooting

**"Access Denied"** → Wrong password in `.env`
**"Connection Refused"** → MySQL not running
**"Database doesn't exist"** → Run `npm run setup-db`

---

📖 For detailed setup, see [DATABASE_SETUP.md](DATABASE_SETUP.md)
