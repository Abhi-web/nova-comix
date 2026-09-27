🌟 NOVA COMIX — Manga & Comic Web Reader + Admin Panel

A modern, high-performance Manga/Comic reader platform built with **React 19**, **Vite**, **Tailwind CSS**, and **Node.js Express** backend with **MongoDB** and **Google Drive Cloud Storage**. Includes an Android mobile app build via **Capacitor**.

---

🚀 Features

- 📖 **Interactive Comic Reader**:
  - Smooth page rendering with natural sorting.
  - Reading progress tracking and history (Saved locally).
  - Responsive vertical webtoon & standard manga reading modes.

🛠️ **Powerful Admin CMS**:
  - Story management (Add/Edit Manga, Genres, Status, Cover & Banner).
  - Batch Chapter upload with drag-and-drop.
  - Visual drag-and-drop page reordering and individual page replacements.
  - Chapter draft & publish workflow.

  ☁️ **Cloud Storage Integration**:
  - Integrated with **Google Drive API** for cloud image storage.
  - Safe stream proxying to protect storage sources.

  📱 **Multi-Platform Support**:
  - Fully responsive web application.
  - Android application support built with **Capacitor**.

  🔐 **Security & Authentication**:
  - JWT token-based authentication with role-based access control (Admin / User).
  - Rate limiting and Helmet security headers.

---

🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, React Router 7, Lucide Icons
- **Backend**: Node.js, Express.js, Mongoose, Multer, Google APIs (`googleapis`)
- **Database**: MongoDB (Atlas)
- **Mobile**: Capacitor (Android)

📁 Project Structure
nova-comix/
│
├── backend/                         # Node.js + Express backend
│   │
│   ├── src/
│   │   ├── controllers/             # API request handlers
│   │   ├── models/                  # MongoDB / Mongoose models
│   │   ├── routes/                  # API routes
│   │   ├── services/                # Business logic & external services
│   │   └── utils/                   # Utility functions & seeders
│   │
│   ├── .env                         # Backend environment variables
│   ├── .env.example                 # Environment configuration template
│   └── package.json                 # Backend dependencies
│
├── src/                             # React frontend
│   │
│   ├── components/                  # Reusable UI components
│   ├── layouts/                     # Navbar, Footer & layouts
│   ├── pages/                       # Application pages
│   │   ├── Home/
│   │   ├── Manga/
│   │   ├── Reader/
│   │   └── Admin/
│   │
│   ├── services/                    # API & frontend services
│   ├── assets/                      # Images & icons
│   ├── App.jsx                      # Root component
│   └── main.jsx                     # Application entry point
│
├── public/                          # Static assets
│
├── android/                         # Capacitor Android project
│
├── .gitignore                       # Git ignored files
├── index.html                       # HTML entry point
├── package.json                     # Frontend dependencies
├── vite.config.js                   # Vite configuration
└── README.md                        # Project documentation

🧰 Tech Stack
| Layer                 | Technology                      | Purpose                                           |
| --------------------- | ------------------------------- | ------------------------------------------------- |
| 🖥️ **Frontend**      | **React 19 + Vite**             | Interactive and fast web interface                |
| 🎨 **Styling**        | **Tailwind CSS**                | Responsive UI and modern styling                  |
| 🧭 **Routing**        | **React Router 7**              | Client-side page navigation                       |
| 🎯 **Icons**          | **Lucide React**                | Modern UI icons                                   |
| ⚙️ **Backend**        | **Node.js + Express.js**        | REST API and server-side logic                    |
| 📤 **File Upload**    | **Multer**                      | Handling comic, cover and banner uploads          |
| 🗄️ **Database**      | **MongoDB Atlas + Mongoose**    | Store Manga, chapters, users and application data |
| ☁️ **Cloud Storage**  | **Google Drive API**            | Store comic pages, covers and banners             |
| 📱 **Mobile**         | **Capacitor + Android**         | Convert the web application into an Android app   |
| 🔐 **Authentication** | **JWT + Bcrypt**                | User authentication and password hashing          |
| 🛡️ **Security**      | **Helmet + Express Rate Limit** | Security headers and API request protection       |
| 🔗 **Configuration**  | **Dotenv**                      | Manage environment variables                      |
| 🌐 **CORS**           | **CORS**                        | Frontend–backend communication                    |


⚙️ Project Setup & Installation

 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** connection string (Atlas or local)

---

 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create and configure environment variables
cp .env.example .env
