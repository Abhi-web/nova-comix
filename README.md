![Home Page]([https://raw.githubusercontent.com/Abhi-web/nova-comix/main/screenshots/home.png](https://github.com/Abhi-web/nova-comix/blob/main/Screenshot%202026-09-27%20215605.png))
![Home Page]([https://raw.githubusercontent.com/Abhi-web/nova-comix/main/screenshots/home.png](https://github.com/Abhi-web/nova-comix/blob/main/Screenshot%202026-09-27%20215638.png))
![Home Page]([https://raw.githubusercontent.com/Abhi-web/nova-comix/main/screenshots/home.png](https://github.com/Abhi-web/nova-comix/blob/main/Screenshot%202026-09-27%20215703.png))
![Home Page]([https://raw.githubusercontent.com/Abhi-web/nova-comix/main/screenshots/home.png](https://github.com/Abhi-web/nova-comix/blob/main/Screenshot%202026-09-27%20215717.png))
![Home Page]([https://raw.githubusercontent.com/Abhi-web/nova-comix/main/screenshots/home.png](https://github.com/Abhi-web/nova-comix/blob/main/Screenshot%202026-09-27%20215728.png))
![Home Page]([https://raw.githubusercontent.com/Abhi-web/nova-comix/main/screenshots/home.png](https://github.com/Abhi-web/nova-comix/blob/main/Screenshot%202026-09-27%20215747.png))
# 🌟 NOVA COMIX

### Manga & Comic Web Reader + Admin CMS

**NOVA COMIX** is a modern, responsive, and high-performance manga/comic reading platform built with **React 19, Vite, Tailwind CSS, Node.js, Express.js, MongoDB Atlas, and Google Drive Cloud Storage**.

The platform provides an immersive comic-reading experience along with a powerful admin CMS for managing stories, chapters, pages, users, and publishing workflows.

It also supports Android application builds using **Capacitor**.

---

## ✨ Features

### 📖 Interactive Comic Reader

* 📚 Manga and comic browsing
* 📄 Smooth page-by-page rendering
* 🔢 Natural page sorting
* 📱 Responsive mobile, tablet, and desktop layout
* 🖼️ Vertical Webtoon reading mode
* 📖 Standard Manga reading mode
* 💾 Local reading progress tracking
* 🕘 Reading history
* ⚡ Fast image loading
* 🔄 Resume reading from the last page

---

### 🛠️ Powerful Admin CMS

Administrators can manage the complete comic library from the dashboard.

#### 📚 Story Management

* ➕ Add new manga/comics
* ✏️ Edit existing stories
* 🗑️ Delete stories
* 🏷️ Manage genres
* 📊 Manage publication status
* 🖼️ Upload cover images
* 🎨 Upload banner images
* 📝 Manage descriptions and metadata

#### 📑 Chapter Management

* ➕ Create chapters
* 📤 Batch chapter uploads
* 📝 Draft chapters
* 🚀 Publish chapters
* ✏️ Edit chapter information
* 🗑️ Delete chapters
* 📊 Manage chapter ordering

#### 🖼️ Page Management

* 📤 Upload multiple pages
* 🖱️ Drag-and-drop page ordering
* 🔄 Replace individual pages
* 🗑️ Delete pages
* 🔢 Automatic/natural page sorting
* 👀 Page preview before publishing

---

## ☁️ Cloud Storage

NOVA COMIX uses **Google Drive API** for storing comic assets.

### Supported Assets

* 📄 Comic pages
* 🖼️ Cover images
* 🎨 Banner images
* 📦 Other supported media assets

The backend handles storage communication so that sensitive storage credentials are not exposed to the frontend.

### Storage Flow

```text
Admin
  │
  ▼
React Admin Panel
  │
  ▼
Node.js / Express API
  │
  ▼
Google Drive API
  │
  ▼
Google Drive Storage
```

Comic images are served through the backend instead of exposing private storage configuration directly to the client.

---

## 🔐 Authentication & Security

NOVA COMIX includes a secure authentication architecture.

### Authentication

* 🔑 JWT-based authentication
* 🔒 Password hashing with Bcrypt
* 👤 User authentication
* 🛡️ Role-based access control
* 👑 Admin authorization
* 🚫 Protected admin routes

### Security Middleware

* 🛡️ Helmet
* 🚦 Express Rate Limit
* 🌐 CORS configuration
* 🔐 Environment variables
* 🔑 Secure password hashing
* 🚫 Protected API endpoints

### Roles

| Role     | Permissions                                    |
| -------- | ---------------------------------------------- |
| 👤 User  | Browse, read comics, track reading progress    |
| 👑 Admin | Manage stories, chapters, pages and publishing |

---

# 🧰 Tech Stack

| Layer             | Technology                      | Purpose                              |
| ----------------- | ------------------------------- | ------------------------------------ |
| 🖥️ Frontend      | **React 19 + Vite**             | Fast interactive web interface       |
| 🎨 Styling        | **Tailwind CSS**                | Responsive and modern UI             |
| 🧭 Routing        | **React Router 7**              | Client-side navigation               |
| 🎯 Icons          | **Lucide React**                | UI icons                             |
| ⚙️ Backend        | **Node.js + Express.js**        | REST API and server logic            |
| 📤 File Upload    | **Multer**                      | Handling file uploads                |
| 🗄️ Database      | **MongoDB Atlas + Mongoose**    | Application data storage             |
| ☁️ Cloud Storage  | **Google Drive API**            | Comic/media storage                  |
| 📱 Mobile         | **Capacitor + Android**         | Android application                  |
| 🔐 Authentication | **JWT + Bcrypt**                | Authentication and password security |
| 🛡️ Security      | **Helmet + Express Rate Limit** | API protection                       |
| 🔗 Configuration  | **Dotenv**                      | Environment variables                |
| 🌐 Communication  | **CORS**                        | Frontend/backend communication       |

---

# 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │      NOVA COMIX      │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
              Web Application                 Android App
                    │                               │
              React + Vite                    Capacitor
                    │                               │
                    └───────────────┬───────────────┘
                                    │
                              REST API
                                    │
                           Node.js + Express
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
          MongoDB Atlas         Google Drive          Auth Layer
              │                     │                     │
       Application Data       Comic Assets          JWT + Bcrypt
```

---

# 📁 Project Structure

```text
nova-comix/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   │   ├── Home/
│   │   ├── Manga/
│   │   ├── Reader/
│   │   └── Admin/
│   │
│   ├── services/
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
│
├── public/
│
├── android/
│
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

# ⚙️ Installation

## 1. Prerequisites

Before running NOVA COMIX, make sure you have:

* **Node.js 18+**
* **npm**
* **MongoDB Atlas account or local MongoDB**
* **Google Cloud account**
* **Google Drive API credentials**
* **Android Studio** — only required for Android builds

Verify Node.js:

```bash
node --version
```

Verify npm:

```bash
npm --version
```

---

# 🚀 Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

> On Windows PowerShell, you can use:

```powershell
Copy-Item .env.example .env
```

Open `.env` and configure your environment variables.

Example:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secure_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_google_redirect_uri

GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id
```

> ⚠️ Never commit `.env` or private API credentials to GitHub.

---

# 🖥️ Frontend Setup

From the project root:

```bash
npm install
```

Create your frontend environment configuration if required:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

# ▶️ Running the Backend

Inside the backend directory:

```bash
npm run dev
```

or, depending on the configured scripts:

```bash
npm start
```

Example backend URL:

```text
http://localhost:5000
```

---

# 🔄 Development Workflow

Run both frontend and backend during development:

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

### Terminal 2 — Frontend

```bash
npm run dev
```

Then open the frontend in your browser.

---

# 📚 Comic Publishing Workflow

The recommended publishing workflow is:

```text
Create Story
     │
     ▼
Add Story Metadata
     │
     ▼
Upload Cover / Banner
     │
     ▼
Create Chapter
     │
     ▼
Upload Chapter Pages
     │
     ▼
Reorder Pages
     │
     ▼
Save as Draft
     │
     ▼
Preview Chapter
     │
     ▼
Publish
     │
     ▼
Chapter Available to Readers
```

This prevents incomplete chapters from becoming publicly visible during upload.

---

# 📖 Reader Flow

```text
Home
 │
 ├── Browse Manga
 │
 ├── Search
 │
 └── Manga Details
          │
          ▼
       Chapters
          │
          ▼
      Comic Reader
          │
          ├── Page Navigation
          ├── Reading Mode
          ├── Progress Tracking
          └── Resume Reading
```

---

# 📱 Android App

NOVA COMIX can be packaged as an Android application using **Capacitor**.

Install Capacitor dependencies:

```bash
npm install @capacitor/core @capacitor/cli
```

Initialize Capacitor:

```bash
npx cap init
```

Add Android:

```bash
npm install @capacitor/android
```

```bash
npx cap add android
```

Build the web application:

```bash
npm run build
```

Sync the web build with Android:

```bash
npx cap sync android
```

Open the Android project:

```bash
npx cap open android
```

Then build/run the application through **Android Studio**.

---

# 🔌 API Structure

A typical API structure can be organized as:

```text
/api
│
├── /auth
│   ├── POST /register
│   ├── POST /login
│   └── GET  /me
│
├── /manga
│   ├── GET    /
│   ├── GET    /:id
│   ├── POST   /
│   ├── PUT    /:id
│   └── DELETE /:id
│
├── /chapters
│   ├── GET    /manga/:mangaId
│   ├── POST   /
│   ├── PUT    /:id
│   └── DELETE /:id
│
├── /pages
│   ├── POST   /upload
│   ├── PUT    /:id
│   ├── DELETE /:id
│   └── PUT    /reorder
│
└── /admin
    └── protected administrative endpoints
```

> Adjust these routes according to the actual implementation in your project.

---

# 🗄️ Database

MongoDB stores application metadata such as:

* 👤 Users
* 📚 Manga/Stories
* 📖 Chapters
* 🖼️ Page metadata
* 🏷️ Genres
* 📊 Publication status
* 🔐 Authentication information

Comic image files themselves are stored in Google Drive.

### Simplified relationship

```text
User
 │
 └── Reading History

Manga
 │
 ├── Genres
 ├── Cover
 ├── Banner
 │
 └── Chapters
       │
       └── Pages
```

---

# 🛡️ Security Recommendations

For production deployment:

* Never expose JWT secrets.
* Never expose Google API credentials in React.
* Keep `.env` outside Git.
* Use strong JWT secrets.
* Validate uploaded file types.
* Limit upload file sizes.
* Validate API request bodies.
* Protect admin routes with authorization middleware.
* Apply rate limiting to authentication endpoints.
* Use HTTPS in production.
* Configure CORS for trusted origins only.
* Sanitize user-controlled data.
* Avoid exposing internal Google Drive identifiers unnecessarily.
* Keep dependencies updated.

---

# 🚀 Production Deployment

A possible production architecture:

```text
                  Internet
                     │
                     ▼
              ┌──────────────┐
              │   Frontend   │
              │ React + Vite │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │   Backend    │
              │ Node/Express │
              └──────┬───────┘
                     │
             ┌───────┴────────┐
             ▼                ▼
       MongoDB Atlas      Google Drive
       Application DB       Media
```

---

# 📈 Future Improvements

Possible future features:

* 🔎 Advanced manga search
* 🏷️ More powerful genre filtering
* ⭐ Ratings and reviews
* ❤️ Favorites/bookmarks
* 🔔 New chapter notifications
* 🌙 Advanced reader themes
* 💬 Comments
* 📥 Offline reading
* 🔄 Cross-device reading synchronization
* 👥 Multiple admin roles
* 📊 Admin analytics dashboard
* 📈 Reader statistics
* 🌍 Multi-language support
* 🔍 SEO optimization
* 🖼️ Image optimization and CDN support

---

# 🤝 Contributing

Contributions are welcome.

### 1. Fork the repository

```bash
git fork https://github.com/Abhi-web/nova-comix
```

### 2. Clone the repository

```bash
git clone https://github.com/Abhi-web/nova-comix.git
```

### 3. Create a feature branch

```bash
git checkout -b feature/my-feature
```

### 4. Commit your changes

```bash
git add .
git commit -m "feat: add my feature"
```

### 5. Push the branch

```bash
git push origin feature/my-feature
```

### 6. Open a Pull Request

---

# 📄 License

Add your project's license here.

Example:

```text
Copyright © 2026 NOVA COMIX

All rights reserved.
```

---

# 👨‍💻 Author

**Abhishek Kushwaha**

GitHub:
https://github.com/Abhi-web

Project:
**NOVA COMIX — Manga & Comic Web Reader**

---

# ⭐ Support

If you find **NOVA COMIX** useful, consider giving the repository a ⭐ on GitHub.

---

## 🔗 Repository

**GitHub:**
https://github.com/Abhi-web/nova-comix

---

### 🚀 NOVA COMIX

> **Read. Explore. Continue the Story. 📖✨**
