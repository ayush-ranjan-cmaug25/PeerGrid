# PEERGRID: THE KNOWLEDGE EXCHANGE
### A Time-Banking Platform for Student Peer-to-Peer Learning

---

## 1. THE CORE CONCEPT

### The Real-World Problem
Students often struggle with specific, micro-topics (e.g., *"I understand C# syntax, but I don't get Async/Await"*). Professional tutors are expensive, and generic videos don't answer specific doubts. Meanwhile, peer-to-peer learning is effective, but it is hard to find the right peer who is available exactly when you are.

### The Solution: "Time-Banking"
PeerGrid removes money from the equation. It creates a closed-loop economy of knowledge. If you spend 30 minutes teaching someone **React**, you earn 30 "Grid Points," which you can spend to get 30 minutes of help in **Calculus**.

---

## 2. UNIQUE FEATURES

### A. The "Micro-Bounty" System
Instead of booking a full hour, allow students to post specific errors or questions with a "Bounty."
* **Scenario:** User A posts a screenshot of a React error with a bounty of 10 Points.
* **Action:** User B comments with the correct fix.
* **Result:** User A clicks "Accept Solution," and the points transfer instantly.
* **Tech Enabler:** Uses **SignalR** for real-time notifications when a bounty is claimed or solved.

### B. "Verified Endorsements" (The Trust Factor)
How do I know you are actually good at Calculus?
* **After a session:** The learner rates the teacher.
* **Logic:** If you receive 5 ratings above 4.5 stars for "C#," the system automatically adds a "Verified C# Tutor" badge to your profile.
* **Tech Enabler:** Uses **SQL Server** aggregations via EF Core 8 to calculate trust scores dynamically.

### C. "Deadlock Breaker" (Circular Economy)
Sometimes a direct swap isn't possible (A helps B, but B can't help A).
* **Triangular Matching:** The system identifies that Student A can help B, B can help C, and C can help A.
* **Tech Enabler:** Graph logic implemented in **.NET 8** identifies these circular dependencies to suggest "Community Swaps."

---

## 3. TECHNOLOGICAL FOUNDATION

### Backend: Robust & Secure
Built on the enterprise-grade **.NET 8 Ecosystem**.
* **Framework:** ASP.NET Core Web API (C#) ensures high performance and type safety.
* **Database:** SQL Server with Entity Framework Core 8 manages the complex relational data of transactions and user profiles.
* **Authentication:** ASP.NET Core Identity with JWT Bearer Tokens protects user data and point balances.
* **Documentation:** Swashbuckle (Swagger).

### Frontend: Modern & Interactive
A cutting-edge interface powered by **React 19**.
* **Build Tool:** Vite 7 (for instant load times).
* **Styling:** Bootstrap 5.3 & Bootstrap Icons.
* **Animations:** Framer Motion & Lenis (smooth scrolling).
* **Real-Time:** Integrated with `@microsoft/signalr` to push live updates (chats, bounty alerts) without page refreshes.
* **State Management:** React Hooks (useState, useEffect).

---

## 4. WHY THIS PROJECT STANDS OUT
* **Conceptually Unique:** It gamifies education and solves a genuine resource allocation problem among students.
* **Modern Stack:** It demonstrates proficiency in the latest industry standards (React 19, .NET 8, SignalR).
* **Complex Logic:** It moves beyond simple CRUD to handle real-time economy balancing, concurrency, and graph-based matching.