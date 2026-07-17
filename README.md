# 🏏 Criclyst

An AI-powered Cricket Analytics Platform built using the MERN Stack. Criclyst provides player analytics, team management, match tracking, and an interactive dashboard with a scalable backend architecture.

---

## 🚀 Features

### 👤 Authentication
- JWT Authentication
- Secure Password Hashing (bcrypt)
- User Registration & Login
- Protected Routes

### 🏏 Player Management
- Create, Read, Update, Delete Players
- Search Players
- Filter Players
- Pagination
- Sorting
- Dynamic Field Selection

### 👥 Team Management
- Complete CRUD Operations
- Team Statistics
- Player References
- Search & Filters

### 🏆 Match Management
- Create & Manage Matches
- Live Matches
- Upcoming Matches
- Completed Matches
- Toss & Winner Management

### 📊 Dashboard
- Overall Statistics
- Live Matches
- Upcoming Matches
- Recent Matches
- Top Run Scorers
- Top Wicket Takers

### ⚡ Backend
- RESTful APIs
- MVC Architecture
- Centralized Error Handling
- Logger Middleware
- Environment Configuration
- Redis Cloud Integration

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JWT
- bcrypt

### Cache
- Redis Cloud

---

## 📂 Folder Structure

```text
criclyst/
│
├── frontend/
│   ├── public/
│   └── src/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 📌 REST APIs

### Authentication
- Register User
- Login User

### Players
- Get All Players
- Get Player by ID
- Create Player
- Update Player
- Delete Player
- Search Players

### Teams
- Get All Teams
- Get Team by ID
- Create Team
- Update Team
- Delete Team

### Matches
- Get All Matches
- Get Match by ID
- Create Match
- Update Match
- Delete Match

### Dashboard
- Overall Statistics
- Live Matches
- Upcoming Matches
- Recent Matches
- Top Players

---

## 🚀 Installation

Clone the repository

```bash
git clone https://github.com/royalknight71/criclyst
```

Go to project directory

```bash
cd criclyst
```

Install backend dependencies

```bash
cd backend
npm install
```

Create a `.env` file

```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REDIS_PASSWORD=your_redis_password
NODE_ENV=development
```

Run backend

```bash
npm run dev
```

Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📈 Current Status

### Backend
- ✅ Complete (V1)

### Frontend
- ✅ UI Complete
- 🚧 Backend Integration In Progress

---

## 🔮 Future Scope

- AI Match Analysis
- AI Match Prediction
- AI Match Summary
- Player Performance Insights
- Advanced Analytics
- Fantasy Cricket Assistant
- Live Score Integration
- Admin Dashboard
- Deployment

---

## 👨‍💻 Author

**Krish Gupta**