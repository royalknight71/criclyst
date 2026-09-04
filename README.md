# 🏏 Criclyst

> A full-stack cricket analytics and real-time live-score platform built with the MERN stack.

Criclyst is a modern cricket analytics platform designed to manage and explore cricket players, teams, matches, statistics, favorites, analytics, and real-time live scores.

The platform combines a scalable REST API architecture with Socket.IO-based real-time communication to provide an interactive cricket experience.

---

## 🚀 Features

### 👤 Authentication & Authorization

- JWT-based authentication
- Secure password hashing using bcrypt
- User registration and login
- Protected routes
- Role-based authorization
- Admin-only routes
- HTTP-only authentication cookies
- Secure production cookie configuration

---

### 🏏 Player Management

- Create, Read, Update, Delete Players
- Search Players
- Filter Players
- Advanced Filtering
- Pagination
- Sorting
- Dynamic Field Selection
- Player Statistics
- Player Details
- Player Profile Navigation
- Player References in Teams and Matches

---

### 👥 Team Management

- Complete CRUD Operations
- Team Details
- Team Statistics
- Team Rankings
- Captain and Coach Information
- Founded Year and Country
- Team Logos and Flags
- Squad / Player References
- Search and Filters
- Pagination
- Sorting
- Dynamic Field Selection

---

### 🏆 Match Management

- Create and Manage Matches
- Match Details
- Live Matches
- Upcoming Matches
- Completed Matches
- Toss Information
- Match Winner
- Player of the Match
- Team References
- Match Filtering
- Pagination
- Sorting
- Dynamic Field Selection

---

### 📊 Dashboard

Criclyst provides a centralized cricket dashboard containing:

- Overall Statistics
- Total Players
- Total Teams
- Total Matches
- Live Matches
- Upcoming Matches
- Recent Matches
- Top Run Scorers
- Top Wicket Takers
- Cricket Statistics and Summaries

---

### 📈 Analytics

The Analytics module provides dynamic cricket statistics generated from the application's database.

Features include:

- Player Performance Analytics
- Batting Statistics
- Bowling Statistics
- Comparative Statistics
- Interactive Charts
- Dynamic Database-Driven Statistics
- Cricket Role-Based Analysis
- Dark-Themed Analytics Interface

> Analytics data is generated from the application's database and does not use fabricated statistics.

---

### ⚖️ Player Comparison

Compare cricket players using an interactive comparison interface.

Features include:

- Player Selection
- Side-by-Side Comparison
- Batting Statistics
- Bowling Statistics
- Performance Metrics
- Dynamic Database-Driven Comparison

---

### ❤️ Favorites

Authenticated users can save their favorite:

- Players
- Teams
- Matches

Favorites are associated with the authenticated user and protected through backend authorization.

---

### 👨‍💻 Admin Dashboard

Criclyst includes an administrative interface for managing platform data.

Admin functionality includes:

- Admin Dashboard
- Player CRUD
- Team CRUD
- Match CRUD
- Admin-Only Protected Routes
- Role-Based Frontend Guards
- Backend Authorization

---

## ⚡ Real-Time Live Scores

Criclyst includes a real-time live-score architecture powered by CricketData/CricAPI and Socket.IO.

### Architecture

```text
CricketData / CricAPI
          │
          ▼
   Backend Polling
          │
          ▼
   Live Match State
          │
          ▼
       Socket.IO
          │
          ▼
    React Frontend
          │
          ▼
     Live Scores UI
```

### Current Capabilities

- Live Cricket Match Data
- Backend-Side API Polling
- Socket.IO Real-Time Communication
- Automatic Score Updates
- Live Match Status
- Match-Specific Socket.IO Rooms
- Live Connection Status
- Graceful External API Failure Handling
- No Fake or Fabricated Cricket Data
- API Credentials Kept Server-Side

### Socket.IO Events

The current live-score implementation uses:

```text
live:matches
live:update
join:match
leave:match
```

Match-specific rooms follow the pattern:

```text
match:<matchId>
```

---

## 🌐 Live Cricket Data

Criclyst currently uses CricketData/CricAPI as its external live-cricket data provider.

The API key is kept strictly on the backend and is never exposed to the React/Vite frontend.

The application uses conservative backend polling because the external API has daily request limitations.

If the external API becomes temporarily unavailable or the API quota is exhausted, Criclyst does not generate fake scores. Instead, the application displays a clear unavailable state and waits for the live feed to become available again.

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- Axios
- Socket.IO Client

### Backend

- Node.js
- Express.js
- JavaScript
- Socket.IO
- REST APIs
- MVC Architecture
- Middleware-Based Architecture
- Centralized Error Handling
- Logger Middleware

### Database

- MongoDB
- Mongoose
- MongoDB Atlas

### Authentication

- JWT
- bcrypt
- HTTP-only Cookies
- Role-Based Authorization

### Real-Time Communication

- Socket.IO
- WebSocket-Based Communication
- Match-Specific Rooms
- Server-Side Event Broadcasting

### Cache / Infrastructure

- Redis Cloud
- Redis integration planned for V2
- Redis Pub/Sub planned for multi-server real-time architecture

### External Data

- CricketData / CricAPI

### Deployment

- Vercel
- Render
- MongoDB Atlas

---

## 🏗️ System Architecture

Criclyst follows a modular full-stack architecture.

```text
                         ┌─────────────────────┐
                         │      React UI       │
                         │      + Vite         │
                         └──────────┬──────────┘
                                    │
                         REST / Socket.IO
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Express Backend   │
                         │      + Node.js      │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌─────────────┐       ┌─────────────┐      ┌──────────────┐
       │  MongoDB    │       │    Redis    │      │  CricketData │
       │  + Mongoose │       │   Optional  │      │   / CricAPI  │
       └─────────────┘       └─────────────┘      └──────┬───────┘
                                                         │
                                                         ▼
                                                  Live Match Data
                                                         │
                                                         ▼
                                                    Socket.IO
                                                         │
                                                         ▼
                                                    React Live UI
```

---

## 📂 Project Structure

```text
criclyst/
│
├── frontend/
│   │
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   │
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# 📌 REST APIs

Criclyst exposes RESTful APIs for the core cricket platform.

## Authentication

```text
POST /api/users/register
POST /api/users/login
```

---

## Players

```text
GET    /api/players
GET    /api/players/:id
POST   /api/players
PATCH  /api/players/:id
DELETE /api/players/:id
```

Supported functionality includes:

- Search
- Filtering
- Advanced Filtering
- Pagination
- Sorting
- Dynamic Field Selection

---

## Teams

```text
GET    /api/teams
GET    /api/teams/:id
POST   /api/teams
PATCH  /api/teams/:id
DELETE /api/teams/:id
```

---

## Matches

```text
GET    /api/matches
GET    /api/matches/:id
POST   /api/matches
PATCH  /api/matches/:id
DELETE /api/matches/:id
```

---

## Favorites

```text
GET    /api/users/favorites
POST   /api/users/favorites
DELETE /api/users/favorites
```

Favorites support:

```text
Players
Teams
Matches
```

---

## Dashboard

The dashboard provides aggregated cricket statistics and summaries including:

```text
Overall Statistics
Live Matches
Upcoming Matches
Recent Matches
Top Run Scorers
Top Wicket Takers
```

---

## Live Cricket

The live-score backend provides endpoints for live cricket data and match-specific information.

```text
GET /api/live-cricket/latest
GET /api/live-cricket/test
GET /api/live-cricket/match/:id
GET /api/live-cricket/match/:id/scorecard
```

> Detailed scorecard and ball-by-ball data availability depends on the data returned by the configured CricketData/CricAPI plan.

---

# 🔌 Real-Time Communication

Criclyst uses Socket.IO for real-time live-score updates.

### Client → Server

```text
join:match
leave:match
```

### Server → Client

```text
live:matches
live:update
```

### Match Rooms

```text
match:<matchId>
```

This allows clients to subscribe to updates for a specific match without creating a separate Socket.IO connection.

---

# 🔐 Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REDIS_PASSWORD=your_redis_password
CRICKET_API_KEY=your_cricket_api_key
NODE_ENV=development
```

### Frontend Environment Variables

Create a `.env` file inside the frontend directory.

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

For production, configure these variables using the deployed backend URL.

> Never commit `.env` files, API keys, passwords, JWT secrets, or other credentials to GitHub.

---

# 🚀 Installation

## 1. Clone the Repository

```bash
git clone https://github.com/royalknight71/criclyst.git
cd criclyst
```

---

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3. Configure Backend Environment

Create:

```text
backend/.env
```

Add the required environment variables:

```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CRICKET_API_KEY=your_cricket_api_key
NODE_ENV=development
```

If Redis is enabled, configure the required Redis environment variables as well.

---

## 4. Start Backend

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:3000
```

---

## 5. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

## 6. Configure Frontend Environment

Create:

```text
frontend/.env
```

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

---

## 7. Start Frontend

```bash
npm run dev
```

Vite will provide the local frontend URL.

---

# 🌍 Production Deployment

Criclyst supports separate frontend and backend deployments.

### Frontend

```text
Vercel
```

### Backend

```text
Render
```

### Database

```text
MongoDB Atlas
```

Production architecture:

```text
                    Internet
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
        ┌──────────┐      ┌──────────┐
        │  Vercel  │      │  Render  │
        │ Frontend │─────▶│ Backend  │
        └──────────┘      └────┬─────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
           MongoDB Atlas    Redis       CricketData
```

---

# 🧪 Testing & Validation

The project has been tested across the major application modules.

Current validation includes:

- Authentication flow
- Protected routes
- Player APIs
- Team APIs
- Match APIs
- Favorites
- Admin authorization
- Dashboard
- Analytics
- Compare module
- Live-score Socket.IO connection
- Live match broadcasting
- Match room join/leave
- Frontend production build
- Backend API integration

The live-score system has been successfully verified with real CricketData/CricAPI match data. Live availability depends on the external API quota and service availability.

---

# 📊 Current Status

## V1 — Core Cricket Analytics Platform

| Feature | Status |
|---|---|
| Authentication | ✅ Complete |
| JWT Authorization | ✅ Complete |
| Player Management | ✅ Complete |
| Team Management | ✅ Complete |
| Match Management | ✅ Complete |
| Dashboard | ✅ Complete |
| Favorites | ✅ Complete |
| Analytics | ✅ Complete |
| Player Details | ✅ Complete |
| Team Details | ✅ Complete |
| Match Details | ✅ Complete |
| Player Comparison | ✅ Complete |
| Admin Dashboard | ✅ Complete |
| Admin CRUD | ✅ Complete |
| Frontend–Backend Integration | ✅ Complete |
| MongoDB Atlas Integration | ✅ Complete |
| Production Deployment | ✅ Complete |

---

## V2 — Real-Time Cricket Platform

| Feature | Status |
|---|---|
| Socket.IO Fundamentals | ✅ Complete |
| Live Score Polling | ✅ Complete |
| Real-Time Live Scores | ✅ Complete |
| Live Match Cards | ✅ Complete |
| Match-Specific Rooms | ✅ Complete |
| Live Match Details | 🚧 In Progress |
| Detailed Live Scorecard | 🚧 In Progress |
| Ball-by-Ball Data | 🚧 Dependent on API Availability |
| Redis Integration | 🚧 Planned |
| Redis Pub/Sub | 🚧 Planned |
| Multi-Server Socket.IO | 🚧 Planned |
| Real-Time Notifications | 🚧 Planned |

---

# 🔮 Future Scope

## 🏏 Advanced Live Cricket

- Detailed Live Scorecards
- Current Batsmen Information
- Current Bowler Information
- Batting Scorecards
- Bowling Scorecards
- Partnerships
- Fall of Wickets
- Extras
- Over-by-Over Visualization
- Ball-by-Ball Visualization
- Match-Specific Live Analytics
- Filtering Live Matches using Criclyst's stored teams

---

## ⚡ Scalable Real-Time Architecture

- Redis Pub/Sub
- Multi-Server Socket.IO
- Horizontal Scaling
- Distributed Event Broadcasting
- Real-Time Notifications
- Improved Live-State Caching
- Production-Grade WebSocket Scaling

---

## 🤖 AI Cricket Intelligence

- AI Match Analysis
- AI Match Prediction
- AI Match Summary
- Player Performance Insights
- AI-Powered Cricket Insights
- Natural-Language Cricket Statistics

---

## 📊 Advanced Analytics

- Advanced Player Analytics
- Team Performance Trends
- Head-to-Head Analysis
- Match Trend Analysis
- Historical Performance
- Advanced Visualizations
- Predictive Analytics

---

## 🧙 Fantasy Cricket Assistant

Potential future capabilities:

- Player Selection Insights
- Fantasy Team Recommendations
- Player Form Analysis
- Match-Condition Analysis
- Fantasy Performance Predictions

---

# 🔒 Security Considerations

Criclyst follows several security practices:

- Password hashing using bcrypt
- JWT authentication
- HTTP-only cookies
- Protected API routes
- Role-based authorization
- Admin-only backend endpoints
- Environment-based configuration
- Server-side API credentials
- CORS configuration
- No external API secrets exposed to the frontend

---

# 🎯 Project Goals

Criclyst is being developed not only as a cricket application but also as a practical full-stack engineering project covering:

```text
REST APIs
    ↓
Authentication
    ↓
Database Design
    ↓
MVC Architecture
    ↓
Caching
    ↓
Real-Time Communication
    ↓
WebSockets
    ↓
External API Integration
    ↓
Scalable Architecture
    ↓
Cloud Deployment
    ↓
AI & Advanced Analytics
```

The long-term goal is to evolve Criclyst into a scalable cricket intelligence platform combining traditional statistics, real-time data, and AI-powered analysis.

---

# 👨‍💻 Author

**Krish Gupta**

GitHub:

https://github.com/royalknight71/criclyst

---

# ⭐ Contributing

Contributions, suggestions, and improvements are welcome.

If you would like to contribute:

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

3. Make your changes
4. Test your changes
5. Commit your changes

```bash
git commit -m "feat: add your feature"
```

6. Push the branch

```bash
git push origin feature/your-feature
```

7. Open a Pull Request

---

# 📄 License

This project is currently maintained as a personal learning and portfolio project
## 👨‍💻 Author

**Krish Gupta**