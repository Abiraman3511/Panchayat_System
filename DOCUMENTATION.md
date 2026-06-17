# Panchayat System - Comprehensive Project Documentation

This document provides an "A to Z" overview of the Panchayat System Application, detailing the technologies used, methodology, packages installed, project planning, implementation steps, core modules, and UI pages.

---

## 1. Project Overview
The **Panchayat System** is a full-stack web application designed to digitize and manage the administrative, demographic, and official data of a village or local municipality. It serves both **Citizens** (for viewing directories, officials, and updates) and **Administrators** (for managing data, adding families, and updating official records).

---

## 2. Technology Stack
The project follows a modern decoupled Client-Server architecture.

### Frontend (Client-Side)
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Vanilla CSS (Modular & Scoped)
- **Routing:** React State-based conditional rendering
- **Environment:** Node.js
- **Hosting / Deployment:** Vercel

### Backend (Server-Side)
- **Framework:** .NET 8 (C#)
- **API Architecture:** RESTful API with ASP.NET Core Controllers
- **ORM (Object-Relational Mapping):** Entity Framework (EF) Core
- **Database:**
  - **Development:** SQLite (`PanchayatSystem.db`)
  - **Production:** PostgreSQL (Configured via `DATABASE_URL` environment variable)
- **Hosting:** Render (Cloud Platform)

---

## 3. Packages Installed

### Frontend Packages (`package.json`)
- **`react` & `react-dom`**: Core library for building UI components.
- **`vite`**: Extremely fast frontend build tool and local development server.
- **`lucide-react`**: Vector icon library used for beautiful, scalable UI icons.
- **`jspdf` & `jspdf-autotable`**: Libraries used for exporting data grids and tables directly into PDF reports.
- **`xlsx`**: Library to export and manipulate spreadsheet data (Excel files).

### Backend Packages (`PanchayatApp.csproj`)
- **`Microsoft.EntityFrameworkCore.Sqlite`**: SQLite database provider for EF Core.
- **`Npgsql.EntityFrameworkCore.PostgreSQL`**: PostgreSQL database provider for EF Core.
- **`Microsoft.EntityFrameworkCore.Design`**: Tooling for EF Core database migrations.
- **`BCrypt.Net-Next`**: Cryptographic library used for securely hashing and verifying user passwords.

---

## 4. Methodology & Architecture
1. **RESTful Communication:** The frontend communicates with the backend exclusively via HTTP POST, GET, PUT, and DELETE requests sent to `/api/...` endpoints.
2. **Environment Awareness:** The frontend dynamically switches its API target using `import.meta.env.DEV` to point to `localhost:8080` during development and the Render URL during production.
3. **Stateless Authentication:** User sessions are managed by storing user states locally (`localStorage`) after a successful login API call.
4. **Role-Based Access Control (RBAC):** The backend protects certain endpoints (like adding or deleting records) by checking for `IsAdmin` flags or specific admin headers, preventing unauthorized citizens from altering data.

---

## 5. Modules & Features

### A. Authentication Module
- **Registration:** A simplified, direct registration flow where users provide a username, password, email, and phone number. Passwords are encrypted via BCrypt before saving.
- **Citizen Login:** Regular users can log in to view public directories and village data.
- **Admin Login:** Dedicated login for administrators providing elevated privileges to modify data.

### B. People Directory Module
- **Hierarchy:** Data is organized logically by `Streets` → `Families` → `People`.
- **Demographics Tracking:** Tracks age, gender, occupation, education, and Aadhaar/Voter ID numbers.
- **Admin Controls:** Admins can Add, Edit, Delete, and Upload Photos for individuals.

### C. Village Officials & Employees Module
- **Village Officials:** Maintains records of the Panchayat President, Ward Members, and Secretaries (including term dates).
- **Village Employees:** Tracks sanitary workers, electricians, water operators, etc.
- **Government Officials:** Details regarding the District Collector, Tahsildar, VAO, etc.

---

## 6. Implementation & Project Planning

### Phase 1: Foundation & Setup
- Initialized the React frontend with Vite.
- Initialized the ASP.NET Core backend.
- Configured CORS (Cross-Origin Resource Sharing) in `Startup.cs` to allow the frontend to safely communicate with the backend.

### Phase 2: Database Design & Seeding
- Created Entity Framework Models (`User`, `Person`, `Family`, `Street`, `VillageOfficial`, etc.).
- Set up `DbInitializer.cs` to automatically seed the database with mock data (Streets, default admin accounts, and placeholder officials) upon startup.

### Phase 3: API Development
- Developed controller classes (`AuthController`, `PeopleDirectoryController`, etc.) to handle incoming HTTP requests.
- Implemented Service layers (`AuthService`, `PeopleDirectoryService`) to keep business logic separate from the controllers.

### Phase 4: Frontend Development
- Built the `Login.jsx` system with split screen aesthetics.
- Developed the `Home.jsx` Dashboard and integrated the specific component views (e.g., `AboutVillage.jsx`, `GovernmentAdministration.jsx`).
- Connected the frontend forms to the backend endpoints using the JavaScript `fetch` API.

### Phase 5: Deployment & Hardening
- Transitioned the database from local SQLite to a persistent cloud PostgreSQL instance on Render.
- Shifted frontend deployment strategy to **Vercel** for high-performance global edge caching.
- Pushed code to GitHub, triggering continuous integration and deployment on Render (Backend) and Vercel (Frontend).

---

## 7. Configuration & Setup Instructions

To run this project locally or deploy it yourself, ensure you have the following setup:

### A. Environment Variables
1. **Frontend (`frontend/.env`):** Not strictly required for development as `import.meta.env.DEV` automatically points to `localhost:8080`.
2. **Backend (Render Environment Variables):** 
   - `DATABASE_URL`: Must contain the production PostgreSQL connection string to persist data (e.g., `postgres://user:password@host/dbname`).

### B. Local Development Steps
1. **Database Update:** Run `dotnet ef database update` in the backend folder to ensure your local SQLite schema is up to date.
2. **Start Backend:** Navigate to the `backend` folder and run `dotnet run`. It will start on `http://localhost:8080`.
3. **Start Frontend:** Navigate to the `frontend` folder, run `npm install` (if first time), then `npm run dev`. It will start on `http://localhost:5173`.

---

## 8. What We Have Accomplished in This Project

During our development and pair programming sessions, we tackled and successfully implemented the following major milestones:

1. **Database Migration to PostgreSQL:** Solved the "Ephemeral Database" issue on Render by provisioning a permanent PostgreSQL database, stopping users from getting wiped out when the cloud container went to sleep.
2. **Authentication Flow Optimization:** Evolved the registration flow by replacing an unreliable email OTP system with a local Math CAPTCHA, and eventually streamlined it entirely into a direct, standard registration form for maximum user convenience.
3. **Port Debugging & Connectivity:** Diagnosed and fixed port collision issues (e.g., Kestrel exit code 1) and cross-origin resource sharing (CORS) errors to ensure the Vite frontend correctly talked to the .NET backend.
4. **End-to-End Git Integration:** Successfully established a deployment pipeline by initializing version control, managing commits, and linking the GitHub repository directly to Vercel and Render for automatic deployments.
5. **Modernized UI/UX:** Built a dynamic, glass-morphism aesthetic using vanilla CSS and responsive split-pane designs for the authentication portals.
6. **PDF & Excel Exports:** Implemented features for local village administrators to download directory data directly into `.pdf` and `.xlsx` formats for offline records.

---

## 9. Pages & Component Breakdown

### 1. `App.jsx`
The root component. It checks `localStorage` for an existing user session. If no user is found, it renders `Login.jsx`. If a user is found, it renders `Home.jsx`.

### 2. `Login.jsx`
The authentication gateway. It features a modern, split-pane design. Users can toggle between "System Login" and "Citizen Registration". It securely sends credentials to the backend and updates the root app state upon success.

### 3. `Home.jsx` (Dashboard)
The main layout wrapper after a successful login. It features a navigation sidebar and a dynamic main content area.

### 4. `AboutVillage.jsx`
A read-only informational page providing a summary, history, and geographical details about the Panchayat.

### 5. `GovernmentAdministration.jsx` & `VillageEmployees.jsx`
Pages dedicated to displaying lists of officials and employees. These pages consume the respective API endpoints to fetch data and render them in neat, styled cards.

### 6. `PeopleDirectory.jsx` 
A complex interface that allows users to view the hierarchy of the village. Admins see additional "Edit", "Add", and "Delete" buttons to manage the community data. Includes export features using `jspdf` and `xlsx`.

---

*This documentation reflects the current state of the Panchayat System repository. As new features are added, this document should be updated to reflect architectural and module changes.*
