<div align="center">
  <h1>✈️ TripWise</h1>
  <p><strong>A Full-Stack Collaborative Travel Planning Platform</strong></p>

  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
  [![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

  [Live Demo](https://tripwise-five.vercel.app) • [Features](#-key-features) • [Getting Started](#-getting-started) • [Tech Stack](#-tech-stack)
</div>

<br />

**TripWise** is a modern travel planning platform designed for **groups traveling together**. It enables users to create shared itineraries, manage trip expenses, store travel documents, and collaborate with friends in real time.

Built with a high-performance Next.js frontend and a secure Spring Boot backend, it delivers a scalable and responsive travel planning experience.

---

## 🌟 Key Features

### 👥 Real-Time Collaboration
- **Role-Based Access Control (RBAC)**: Supports Trip Creator (Owner) and Collaborators (Members).
- **Invite System**: Creators can effortlessly invite collaborators via their username.
- **Member Management**: Creators can manage access, and members can leave a trip anytime.

### 📅 Trip Management
- **Itinerary Planner**: Plan daily activities with time, location, and detailed notes.
- **Expense Tracker**: Track shared spending with categorized expenses and transparent budget visibility.
- **Document Vault**: Securely upload and manage flight tickets, hotel confirmations, and other critical travel documents.
- **Cover Photos**: Personalize trips with custom cover image uploads.

---

## 🚀 Deployment & Configuration
The application is deployed with a decoupled architecture to ensure scalability and cross-browser reliability.

- **Frontend**: Next.js 15 hosted on Vercel.

- **Backend**: Spring Boot 3.x hosted on Render.

- **Database**: Managed PostgreSQL.

- **Cloud Storage**: Cloudinary (Used for all reservations, travel documents, and trip cover photos).

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS, Axios, Framer Motion |
| **Backend** | Spring Boot 3.x, Spring Security, JPA/Hibernate |
| **Database** | PostgreSQL |
| **Storage** | Cloudinary (Cloud-based Image & Document Storage) |
| **Authentication** | JWT (Stateless Authentication) |
| **DevOps** | Docker, Docker Compose, GitHub Actions |

---

## 🏗️ Project Architecture

```plaintext
tripwise/
├── frontend/          # Next.js 15 application (App Router)
├── backend/           # Spring Boot REST API
├── docker-compose.yml # Container orchestration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop/) & Docker Compose
- [Node.js](https://nodejs.org/) (if running frontend locally outside Docker)
- [Java 17+](https://adoptium.net/) (if running backend locally outside Docker)

### Environment Variables

Ensure you have the following environment variables configured:

**Backend (e.g., in `.env` or Render):**
| Key | Description |
|:---|:---|
| `DATABASE_URL` | PostgreSQL connection string |
| `CLOUDINARY_URL` | `cloudinary://<api_key>:<api_secret>@<cloud_name>` |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `CORS_ALLOWED_ORIGINS` | `https://tripwise-five.vercel.app` (or your local frontend URL) |

**Frontend (e.g., in `.env.local` or Vercel):**
| Key | Description |
|:---|:---|
| `NEXT_PUBLIC_API_URL` | `https://tripwise-qxu7.onrender.com/api` (or your local backend URL) |

### Quick Start (using Docker)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/tripwise.git
   cd tripwise
   ```

2. **Start the application:**
   ```bash
   docker compose up --build
   ```

3. **Access the application:**
   - **Frontend:** `http://localhost:3000` (or as configured)
   - **Backend API:** `http://localhost:8080/api`

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

## 🧠 Technical Highlights & Troubleshooting

### URL-Based State Persistence
The UI state is maintained using URL query parameters (e.g., `/trip/123?tab=expenses`). This allows for easily shareable links and seamless state persistence across page refreshes.

### UUID Resource Identification
All core entities utilize **UUIDs** instead of sequential numeric IDs to ensure non-predictable resource access and robust API security.

<details>
<summary><b>Cross-Origin Authentication (The Safari 403 Issue)</b></summary>
<br>
Initially, the app used <b>HttpOnly Cookies</b> for JWT delivery. However, this caused <code>403 Forbidden</code> errors on Safari due to <b>Intelligent Tracking Prevention (ITP)</b>, which blocks third-party cookies by default in cross-domain environments.

<b>Solution:</b>
<ul>
  <li>Switched to <b>JWT in Response Body</b> upon login.</li>
  <li>Implemented <b>Axios Interceptors</b> to manually attach the token from <code>localStorage</code> to the <code>Authorization: Bearer &lt;token&gt;</code> header for every request. This ensures cross-browser compatibility even with strict privacy settings.</li>
</ul>
</details>

<details>
<summary><b>Cloudinary PDF Delivery (The 401 Issue)</b></summary>
<br>
Cloudinary may block direct access to PDF files if they are uploaded with restricted permissions or if "Strict Transformations" are enabled.

<b>Solution:</b>
<ul>
  <li>Configured <code>access_mode: public</code> and <code>resource_type: auto</code> during the upload process in <code>FileService.java</code>.</li>
  <li>Enabled <b>"Allow delivery of PDF and ZIP files"</b> in the Cloudinary Settings console to permit direct link access.</li>
</ul>
</details>

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
