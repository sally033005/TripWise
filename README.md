# TripWise ✈️
### A Full-Stack Collaborative Travel Planning Platform

**TripWise** is a modern travel planning platform designed for **groups traveling together**.  
It enables users to **create shared itineraries, manage trip expenses, store travel documents, and collaborate with friends in real time**.

Built with a **high-performance Next.js frontend** and a **secure Spring Boot backend**, TripWise delivers a scalable and responsive travel planning experience.

---

# 🌟 Features

## 👥 Real-Time Collaboration

TripWise is built for **group travel coordination**.

- **Role-Based Access Control (RBAC)**
  - Trip Creator (Owner)
  - Collaborators (Members)

- **Invite System**  
  Creators can invite collaborators via **username**.

- **Member Management**
  - Creators can remove members
  - Members can leave a trip anytime

---

## 📅 Trip Management

### Itinerary Planner

Plan daily activities with:

- Time
- Location
- Notes

Perfect for organizing **multi-day travel schedules**.

### Expense Tracker

Track shared spending:

- Categorized expenses
- Budget tracking
- Group cost visibility

### Document Vault

Securely upload and manage:

- Flight tickets
- Hotel confirmations
- Reservations
- Travel documents

### Cover Photos

Personalize trips with **custom image uploads**.

---

# 🧠 Technical Highlights

### UUID Resource Identification

All core entities use **UUIDs** instead of sequential IDs for:

- Improved security
- Non-predictable resource access
- Safer public APIs

---

### URL-Based State Persistence

TripWise maintains UI state using **URL query parameters**.

Example:

```
/trip/123?tab=expenses
```

Benefits:

- Page refresh keeps current tab
- Shareable links to specific views
- Better UX for collaborative planning

---

### Modern Responsive UI

The frontend uses:

- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **Next.js App Router** for optimized rendering

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose |
|------------|--------|
| **Next.js 15 (App Router)** | Frontend framework |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **Axios** | API client |
| **React Hooks** | State management |
| **Framer Motion** | UI animations |

---

## Backend

| Technology | Purpose |
|------------|--------|
| **Spring Boot 3.x** | Backend framework |
| **Spring Security** | Authentication & authorization |
| **JWT** | Stateless authentication |
| **JPA / Hibernate** | ORM |
| **PostgreSQL / MySQL** | Database |
| **Local File Storage** | Document uploads |

---

## DevOps & Infrastructure

| Technology | Purpose |
|------------|--------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-service orchestration |
| **GitHub Actions** | CI/CD |
| **Git** | Version control |

---

# 🚀 Quick Start (Docker)

The easiest way to run **TripWise** is with **Docker Compose**, which starts the:

- Frontend
- Backend
- Database

automatically.

---

## Prerequisites

- **Docker Desktop**

Install:  
https://www.docker.com/products/docker-desktop/

---

## 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/tripwise.git
cd tripwise
```

---

## 2️⃣ Start the application

```bash
docker compose up --build
```

---

## 3️⃣ Access the application

| Service | URL |
|--------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/api |

---

# 🏗️ Project Architecture

TripWise uses a **multi-container Docker architecture**.

```
TripWise
│
├── frontend/        Next.js 15 application
│
├── backend/         Spring Boot REST API
│
├── docker-compose.yml
│
└── uploads/         Persistent storage for files
```

### Frontend

Handles:

- UI rendering
- Client state
- API communication

### Backend

Handles:

- Business logic
- Authentication (JWT)
- Authorization (RBAC)
- File processing

### Docker Compose

Orchestrates:

- Service networking
- Database connection
- Persistent volumes

---

# 🔐 Roles & Permissions

| Feature | Creator (Owner) | Collaborator |
|--------|-----------------|--------------|
| Edit Trip Details | ✅ | ✅ |
| Invite Members | ✅ | ❌ |
| Remove Members | ✅ | ❌ |
| Add/Edit Activities | ✅ | ✅ |
| Leave Trip | ❌ (must delete trip) | ✅ |

---

# 🛡️ DevOps & Infrastructure

### Multi-Stage Docker Builds

Ensures:

- Smaller production images
- Faster container startup
- Better build caching

---

### Persistent Storage

Uploaded files are stored in **Docker volumes**, ensuring they remain available even if containers restart.

---

### Network Isolation

Backend services communicate using an **internal Docker network**, improving security and separation.

---

# 🗺️ Future Roadmap

Planned improvements:

- [ ] **Google Maps Integration**  
      Interactive map view for itinerary locations

- [ ] **Offline Mode (PWA)**  
      Access trip data during flights

- [ ] **Split-Bill System**  
      Automatic group expense settlement

- [ ] **AI Itinerary Generator**  
      Generate travel plans using OpenAI

---

# 📄 License

Distributed under the **MIT License**.

See `LICENSE` for more information.

---

# ⭐ Support the Project

If you found this project useful:

- ⭐ Star the repository
- 🍴 Fork the project
- 🛠️ Contribute improvements
