# Portfolio Labs 🚀

[![Next.js](https://img.shields.io/badge/Next.js-13-blue?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-blue?logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4-green?logo=mongodb)](https://www.mongodb.com/)

**Portfolio Labs** is a modern, full-stack web application for AI/ML professionals and developers to showcase their projects, skills, and experience in a clean, elegant portfolio format.

---

## 🚀 Features

* Secure authentication with **NextAuth.js**, **Google OAuth**, and **GitHub Auth**
* Full **CRUD profile management**
* Showcase **AI/ML projects** with images, links, and skills
* Add, edit, and remove **skills**
* Responsive design for desktop, tablet, and mobile
* Modern UI with gradient backgrounds and smooth animations

---

## 🛠️ Tech Stack

* **Frontend:** Next.js, React, Tailwind CSS
* **Authentication:** NextAuth.js
* **Database:** MongoDB
* **Icons:** React Icons (Feather)
* **Backend:** Next.js API Routes

---

## 🌐 Demo

[Live Demo](#) (Replace `#` with your deployed link)

---

## 📦 Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd portfolio_labs
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create `.env.local` in the root:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# MongoDB connection string
DATABASE_URL=your-mongodb-connection-string

# OAuth (optional)
# GITHUB_ID=your-github-id
# GITHUB_SECRET=your-github-secret
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. **Run development server**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
portfolio_labs/
├── components/          # Reusable React components
├── pages/
│   ├── api/            # API routes
│   │   ├── auth/       # Authentication endpoints
│   │   ├── profile.js  # Profile CRUD
│   │   └── projects.js # Projects CRUD
│   ├── _app.js         # Next.js App component
│   ├── index.js        # Home page
│   ├── profile.js      # Profile page
│   └── projects.js     # Projects page
├── public/             # Static assets
├── styles/             # Global styles
├── .env.local          # Environment variables
└── package.json        # Dependencies and scripts
```

---

## 🎯 Usage

### Profile Management

1. Sign in
2. Navigate to **Profile** page
3. Edit your info: skills, education, experience, contacts
4. Save changes

### Project Management

1. Navigate to **Projects** page
2. Click **New Project**
3. Add title, description, skills used, links, and images
4. Use search/filter to organize projects

---

