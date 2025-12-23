# PeerGrid - The Decentralized Knowledge Exchange

**PeerGrid** is a next-generation peer-to-peer learning platform designed to democratize education. It creates a dynamic knowledge economy where users earn **Grid Points (GP)** by teaching skills and spend them to learn new ones. By gamifying the learning process and removing monetary barriers, PeerGrid fosters a collaborative community of lifelong learners.

---

## 🚀 Key Features

-   **🔄 Skill Exchange Economy**: A unique credit-based system where knowledge is the currency. Teach to earn, learn to spend.
-   **📊 Real-Time Dashboard**: Track your upcoming sessions, accumulated Grid Points, and skill portfolio in a futuristic, glassmorphism-inspired interface.
-   **🧠 Doubt Board**: Post specific questions or "bounties" with GP rewards. Experts can accept challenges to solve doubts and earn points.
-   **📹 Live Peer Sessions**: Seamlessly join video rooms for interactive learning sessions (integrated with WebRTC/SignalR).
-   **🏆 Gamification**: Earn badges and reputation points as you contribute more to the community.
-   **🎨 Modern Aesthetic**: Built with a "Deep Learn Blue" and "Grid Green" theme, featuring glassmorphism, glowing accents, and smooth animations.

---

## 🛠️ Technology Stack

### Frontend
-   **Framework**: [React](https://react.dev/) (v18+)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: Vanilla CSS3 with CSS Variables & Flexbox/Grid
-   **HTTP Client**: [Axios](https://axios-http.com/)
-   **Real-time Communication**: [SignalR Client](https://www.npmjs.com/package/@microsoft/signalr) (for live updates)

### Backend
-   **Framework**: [ASP.NET Core](https://dotnet.microsoft.com/en-us/apps/aspnet)
-   **Language**: C#
-   **ORM**: [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
-   **API Documentation**: Swagger / OpenAPI

### Database
-   **Primary DB**: MySQL (Relational Data Management)

---

## � Project Structure

```bash
PeerGrid/
├── frontend/               # React Client Application
│   ├── src/
│   │   ├── components/     # Reusable UI Components (DoubtBoard, SkillProfile, etc.)
│   │   ├── assets/         # Static assets (Logos, Icons)
│   │   ├── App.css         # Global Styles & Variables
│   │   └── main.jsx        # Entry Point
│   └── vite.config.js      # Vite Configuration
│
├── backend/                # ASP.NET Core Web API
│   ├── Controllers/        # API Endpoints
│   ├── Models/             # Database Entities
│   ├── Data/               # EF Core DbContext
│   ├── Services/           # Business Logic
│   └── Program.cs          # App Configuration & Middleware
│
└── README.md               # Project Documentation
```

---

## 🏁 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
-   **Node.js** (v18 or higher)
-   **.NET SDK** (v8.0 or higher)
-   **MySQL Server** (running locally or via Docker)

### 1. Database Setup
Ensure your MySQL server is running. Update the connection string in `backend/appsettings.json` if necessary.
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=peergrid_db;User=root;Password=your_password;"
}
```
Apply migrations to create the database:
```bash
cd backend
dotnet ef database update
```

### 2. Backend Setup
Navigate to the backend directory and start the API server.
```bash
cd backend
dotnet restore
dotnet run
```
The API will be available at `https://localhost:7245` (or similar, check console output).

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and start the React app.
```bash
cd frontend
npm install
npm run dev
```
The application will be accessible at `http://localhost:5173`.

---

## 📖 Usage Guide

1.  **Create a Profile**: Set up your "Student Profile" by listing skills you can teach (Offered) and skills you want to learn (Needed).
2.  **Earn Points**: Go to the **Doubt Board** and look for open bounties. Accept a challenge to help a peer and earn the listed GP.
3.  **Spend Points**: Use your earned GP to book sessions with experts or post your own doubts on the board.
4.  **Join Sessions**: Check the **Session Dashboard** for upcoming scheduled meetings and join the video room with one click.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
