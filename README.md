# 🎓 PeerGrid: The Knowledge Exchange
### *A Time-Banking Platform for Student Peer-to-Peer Learning*

---

## 🚀 The Core Concept

### 🌍 The Real-World Problem
Students often struggle with specific, micro-topics (e.g., *"I understand C# syntax, but I don't get Async/Await"*). Professional tutors are expensive, and generic videos don't answer specific doubts. Meanwhile, peer-to-peer learning is effective, but it is hard to find the right peer who is available exactly when you are.

### 💡 The Solution: "Time-Banking"
**PeerGrid** removes money from the equation. It creates a closed-loop economy of knowledge. 
> **If you spend 30 minutes teaching someone React, you earn 30 "Grid Points," which you can spend to get 30 minutes of help in Calculus.**

---

## ✨ Unique Features

### 🎯 A. The "Micro-Bounty" System
Instead of booking a full hour, allow students to post specific errors or questions with a "Bounty."
*   **Scenario:** User A posts a screenshot of a React error with a bounty of **10 Points**.
*   **Action:** User B comments with the correct fix.
*   **Result:** User A clicks "Accept Solution," and the points transfer instantly.
*   **Tech Enabler:** Uses **SignalR** for real-time notifications when a bounty is claimed or solved.

### 🛡️ B. "Verified Endorsements" (The Trust Factor)
How do I know you are actually good at Calculus?
*   **After a session:** The learner rates the teacher.
*   **Logic:** If you receive 5 ratings above 4.5 stars for "C#," the system automatically adds a **"Verified C# Tutor"** badge to your profile.
*   **Tech Enabler:** Uses **SQL Server** aggregations via EF Core 8 to calculate trust scores dynamically.

### 🔄 C. "Deadlock Breaker" (Circular Economy)
Sometimes a direct swap isn't possible (A helps B, but B can't help A).
*   **Triangular Matching:** The system identifies that Student A can help B, B can help C, and C can help A.
*   **Tech Enabler:** Graph logic implemented in **.NET 8** identifies these circular dependencies to suggest "Community Swaps."

---

## 🛠️ Technological Foundation

### 🔙 Backend: Flexible Dual-Architecture
The system is built to be backend-agnostic. You can run it with either:

| Feature | .NET Ecosystem (Option A) | Spring Boot Ecosystem (Option B) |
| :--- | :--- | :--- |
| **Framework** | **.NET 8** (ASP.NET Core Web API) | **Spring Boot 3.5** (Java 21) |
| **Database** | **SQL Server** (EF Core 8) | **MySQL** (Spring Data JPA) |
| **Real-Time** | **SignalR** (Native Hubs) | **WebSocket** (STOMP) |
| **Security** | ASP.NET Identity + JWT | Spring Security + JJWT |
| **Docs** | Swashbuckle (Swagger) | Springdoc OpenAPI |

### 🎨 Frontend: Modern & Responsive
*   **Core:** React 19 + Vite 7
*   **Styling:** Bootstrap 5.3 + Bootstrap Icons (Glassmorphism design system)
*   **Motion:** Framer Motion 12 + Lenis (Smooth Scroll)
*   **Networking:** Axios + Dynamic WebSocket Client (SignalR/STOMP)

---

## 📂 Project Structure

```bash
PeerGrid/
├── frontend/                   # React 19 Client Application
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   ├── services/           # Service Layer (API calls)
│   │   ├── App.css             # Global Styles & Variables
│   │   └── main.jsx            # Entry Point
│   └── vite.config.js          # Vite Configuration
│
├── backend(.NET)/              # ASP.NET Core Web API (.NET 8)
│   ├── Controllers/            # API Endpoints
│   ├── Models/                 # Database Entities
│   ├── Hubs/                   # SignalR Hubs
│   └── Program.cs              # App Configuration
│
├── backend(Spring Boot)/       # Spring Boot 3.5 (Java 21)
│   ├── src/main/java/          # Java Source Code
│   │   ├── controller/         # REST Controllers
│   │   ├── entity/             # JPA Entities
│   │   └── config/             # WebSocket & Security Config
│   └── pom.xml                 # Maven Dependencies
│
└── README.md                   # Project Documentation
```

---

## 🏁 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
-   **Node.js** (v18 or higher)
-   **.NET SDK** (v8.0 or higher) - *If using .NET Backend*
-   **Java JDK** (v21 or higher) - *If using Spring Boot Backend*
-   **SQL Server** (LocalDB or Docker) or **MySQL**

### 1️⃣ Database Setup
Ensure your SQL Server is running. Update the connection string in `backend/appsettings.json` if necessary.
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=PeerGridDb;Trusted_Connection=True;MultipleActiveResultSets=true"
}
```
Apply migrations to create the database:
```bash
cd backend
dotnet ef database update
```

### 2️⃣ Backend Setup (Choose One)

**Option A: Run with .NET (SQL Server)**
1.  Configure connection string in `backend(.NET)/appsettings.json`.
2.  Run migrations and start server:
    ```bash
    cd "backend(.NET)"
    dotnet ef database update
    dotnet run
    ```
    *Server runs on: `https://localhost:7245`*

**Option B: Run with Spring Boot (MySQL)**
1.  Configure database in `backend(Spring Boot)/src/main/resources/application.properties` (or `application-secrets.properties`).
2.  Run the application:
    ```bash
    cd "backend(Spring Boot)"
    mvnw spring-boot:run
    ```
    *Server runs on: `http://localhost:5000`*

### 3️⃣ Frontend Setup
Open a new terminal, navigate to the frontend directory, and start the React app.
```bash
cd frontend
npm install
npm run dev
```
The application will be accessible at `http://localhost:5173`.

### 4️⃣ Google OAuth Setup
To enable "Sign in with Google", you need to configure a Google Cloud Project.

#### A. Create Credentials
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project (e.g., "PeerGrid").
3.  Navigate to **APIs & Services** -> **OAuth consent screen**.
    *   Select **External** and create.
    *   Fill in the app name and user support email.
4.  Navigate to **Credentials** -> **Create Credentials** -> **OAuth client ID**.
    *   Application type: **Web application**.
    *   **Authorized JavaScript origins**: Add `http://localhost:5173`.
    *   **Authorized redirect URIs**: Add `http://localhost:5173`.
5.  Copy your **Client ID**.

#### B. Backend Configuration
The backend needs the Client ID to validate tokens sent by the frontend.
```bash
cd backend
dotnet user-secrets set "Google:ClientId" "YOUR_GOOGLE_CLIENT_ID"
```

#### C. Frontend Configuration
The frontend needs the Client ID to initialize the Google Sign-In button.
1.  Navigate to the `frontend` directory.
2.  Create a file named `.env` (if it doesn't exist).
3.  Add the following line:
    ```env
    VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
    ```

### 5️⃣ Payment Gateway Setup (Razorpay)
To enable payments, you need to configure Razorpay Test Keys.
1.  Sign up for a [Razorpay Dashboard](https://dashboard.razorpay.com/) account.
2.  Switch to **Test Mode**.
3.  Go to **Settings** -> **API Keys** -> **Generate Key**.
4.  Run the following commands in the `backend` directory to securely store your keys:
    ```bash
    cd backend
    dotnet user-secrets init
    dotnet user-secrets set "Razorpay:KeyId" "YOUR_KEY_ID"
    dotnet user-secrets set "Razorpay:KeySecret" "YOUR_KEY_SECRET"
    ```
    *(Replace `YOUR_KEY_ID` and `YOUR_KEY_SECRET` with the actual values from Razorpay)*

---

## 🌟 Why This Project Stands Out
*   **Conceptually Unique:** It gamifies education and solves a genuine resource allocation problem among students.
*   **Modern Stack:** It demonstrates proficiency in the latest industry standards (React 19, .NET 8, SignalR).
*   **Complex Logic:** It moves beyond simple CRUD to handle real-time economy balancing, concurrency, and graph-based matching.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
