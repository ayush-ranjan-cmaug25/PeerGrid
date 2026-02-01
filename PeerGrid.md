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

### Architectural Design
PeerGrid follows a **Decoupled Client-Server Architecture**. The frontend is a standalone Single Page Application (SPA) that consumes RESTful APIs from the backend. This separation allows specialized focus on UI responsiveness while ensuring backend scalability.

### Backend: The Dual-Stack Engine
A unique feature of PeerGrid is its ability to run on two industry-standard backend stacks. This demonstrates versatility and architectural clean code practices.

#### **Option A: The .NET Powerhouse**
*   **Core:** Built on **.NET 8**, leveraging the high-performance Kestrel web server.
*   **Data Layer:** Uses **Entity Framework Core 8** with **SQL Server**. It employs Code-First migrations for seamless schema evolution.
*   **Real-Time:** **SignalR** Hubs manage instant messaging and live video signaling.
*   **Security:** Implements **Identity Core** with JWT Bearer tokens for stateless authentication.

#### **Option B: The Spring Boot Fortress**
*   **Core:** Built on **Spring Boot 3.5** (Java 21).
*   **Data Layer:** **Spring Data JPA** (Hibernate) connected to **MySQL**, ensuring ACID compliance for transaction credits.
*   **Connectivity:** **WebSocket** endpoints with STOMP messaging for broad compatibility.
*   **Security:** **Spring Security** filter chain with JJWT for rigorous access control.

### Frontend: Next-Gen Interactivity
The user interface is not just a form-submitter; it is a dynamic, stateful application.
*   **React 19:** Utilizes the latest concurrent rendering features.
*   **Vite 7:** Ensures lightning-fast Hot Module Replacement (HMR) during development.
*   **Framer Motion:** Provides physics-based animations for a "premium" app feel.
*   **Dual-Protocol Networking:** The frontend intelligently switches between `SignalRConnection` and `StompClient` based on the active backend.

---

## 4. WHY THIS PROJECT STANDS OUT
*   **Architectural Flexibility:** Few student projects demonstrate the ability to maintain feature parity across two completely different backend stacks (.NET & Java).
*   **Economic Modeling:** It implements a "Closed-Loop Economy" (Time Banking), requiring complex transaction logic beyond standard CRUD.
*   **Graph Algorithms:** The "Deadlock Breaker" (Triangular Matching) feature solves circular dependencies, showcasing algorithmic thinking.
*   **Real-World Integrations:** Includes **Google OAuth** for seamless onboarding and **Razorpay** for real-world payment simulation (buying points).