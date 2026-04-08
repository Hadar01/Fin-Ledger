# 💸 Expense Tracker

A full-stack **Expense Tracker** application built with the **MERN stack** (MongoDB, Express.js, React, Node.js) that allows users to register, log in, and manage their income and expenses. Users can view summaries, download and manage transactions through a responsive dashboard.

---

## 🌐 Live Demo

- **Frontend (Vercel)**: [https://expense-tracker-gray-one.vercel.app](https://expense-tracker-gray-one.vercel.app)
- **Backend (Render)**: [https://expense-tracker-x2k7.onrender.com](https://expense-tracker-x2k7.onrender.com)

---

## 🚀 Tech Stack

- **Frontend**: React (Vite), Axios, React Router DOM
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt
- **Database**: MongoDB Atlas
- **Deployment**:
  - Frontend: Vercel
  - Backend: Render

---

## ✨ Features

- 🔐 User registration & login with JWT authentication
- 🔒 Password hashing using bcrypt
- ➕ Add, edit, and delete expenses/income
- 📦 Upload receipts (images) — stored in `/uploads`
- 📊 Dashboard with income & expense summary
- 🧭 Protected routes using token-based auth
- 📱 Responsive design
- 🌐 Hosted frontend and backend

---

## 🛠️ Run Locally

Follow the steps below to run the app locally on your machine.

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/naman005/expense-tracker.git
cd expense-tracker
```
### 2️⃣ Set Up the Backend
```bash
cd backend
npm install
```
### 🔐 Create a .env file inside backend/:

```bash
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### ▶ Start the server:
```bash
npm start
```

Server will run at: `http://localhost:8000`

---

### 3️⃣ Set Up the Frontend
```bash
cd ../frontend
npm install
```
### 🔐 Create a .env file inside frontend/:
```bash
VITE_API_URL=http://localhost:8000
```
### ▶ Start the frontend:
```bash
npm run dev
```

Frontend will run at: `http://localhost:5173`


