# Syahreza Satria's Developer Portfolio (2026 Edition)

A premium, interactive developer portfolio designed to showcase professional skills, projects, and achievements. Built with the latest modern web technologies, this platform goes beyond a static resume by offering an engaging, animated user interface, a real-time guestbook, and a secure administrator dashboard for live content management.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-emerald?style=flat-square&logo=supabase)](https://supabase.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=flat-square&logo=framer)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

---

## 💡 Why This Project Exists

In today's fast-paced digital landscape, a developer's true capabilities are best demonstrated through live, interactive experiences rather than plain text. This project was built to:

*   **Showcase Full-Stack Proficiency:** Go beyond a simple landing page by integrating a real-time guestbook and a complete custom CRUD dashboard with secure authentication.
*   **Experiment with Modern Technologies:** Serve as a practical playground for implementing Next.js 16 (App Router), React 19, Supabase real-time capabilities, and complex UI animations with Framer Motion.
*   **Create a Living Digital Identity:** Provide a centralized, easily updatable platform that evolves alongside my career, skills, and projects, ensuring visitors always see the most current representation of my professional journey.

---

## 🚀 Key Features

*   **Vibrant & Modern UI/UX**: Crafted with a premium dark-mode aesthetic, custom gradients, glassmorphism, spotlight card effects, and rotating/shiny text animations.
*   **Adaptive Responsive Layout**: Implements a sticky side navigation for desktops and a fluid, responsive dock menu for mobile and tablet views.
*   **Dynamic Project Gallery (Supabase-integrated)**:
    *   **Live Search & Filtering**: Instant client-side search across titles and descriptions, with smooth tab-based filters.
    *   **Immersive Modal View**: Framer Motion animated modal detailing tech stacks, features, screenshots, and live demo links.
*   **Admin CRUD Control Center**:
    *   **Authentication & Authorization**: Integrated Google OAuth via Supabase checking for specific admin privileges.
    *   **On-Site Editing**: Secure interactive modal forms to add, update, or remove projects directly from the web interface.
*   **Real-time Guestbook Chat**:
    *   **Social Sign-In**: Quick Google OAuth sign-in for users to leave a message.
    *   **Real-time Synchronization**: Live updates for new posts, replies, and reactions using Supabase Postgres replication.
*   **Interactive Skillset Grid**: Interactive filtering of skills and tools with layout-preserving spring animations.
*   **GitHub Activity Integration**: Displays live open-source contributions using `react-github-calendar`.
*   **Comprehensive Sections**: Curated pages for *About Me* (education/career timeline), *Achievements* (credential listings), *Gears* (workspace setup details), and *Contact*.

---

## 🛠️ Tech Stack

*   **Framework**: Next.js 16 (App Router), React 19
*   **Styling**: Tailwind CSS v4, Radix UI, Shadcn UI
*   **Animations**: Framer Motion (v12), GSAP
*   **Backend & Database**: Supabase (PostgreSQL, Realtime Channels, Auth)
*   **Icons & Assets**: Lucide React, React Icons

---

## 📋 Prerequisites

Before setting up the project, make sure you have the following installed:
*   **Node.js**: `v18.x` or newer (recommended: `v20.x` or higher)
*   **NPM**: `v9.x` or newer
*   A **Supabase** account and active project instance

---

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/syahreza-satria/portfolio-2026.git
cd portfolio-2026
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Duplicate the `.env.example` file and rename it to `.env`:
```bash
cp .env.example .env
```
Open `.env` and fill in your Supabase project API credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Supabase Schema Migration
In your **Supabase SQL Editor**, execute the necessary SQL scripts to provision the tables (`projects`, `guestbook`), Row Level Security (RLS) policies, and database replication for real-time functionality. 

### 5. Setup Google OAuth in Supabase
1. Go to **Supabase Dashboard** -> **Authentication** -> **Providers**.
2. Select **Google**, toggle it **Enabled**, and fill in your Client ID and Client Secret from the [Google Cloud Console](https://console.cloud.google.com/).
3. Add the redirect URI provided by Supabase back to your Google Cloud Console credentials.

---

## 🏃 Running the Application

### Development Server
Start the local server with hot-reloading:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### Production Build
Generate an optimized production build:
```bash
npm run build
```

### Start Production Server
Run the compiled code locally:
```bash
npm run start
```

---

## 📂 Project Structure

```text
├── public/                 # Static assets
└── src/
    ├── app/                # Next.js App Router (pages and layouts)
    │   ├── about/          # Career timeline & bio
    │   ├── achievement/    # Certificates list
    │   ├── contact/        # Contact form page
    │   ├── gears/          # Workspace tech specs & equipment
    │   ├── guestbook/      # Real-time chat & guest posts
    │   └── projects/       # Database showcase with admin CRUD modal
    ├── components/         # React Components
    │   ├── custom/         # UI layouts (SideNav, GitHub Calendar, Loaders, Forms)
    │   └── ui/             # Radix & Shadcn based UI primitives
    ├── constants/          # Application-wide static data & animations
    ├── hooks/              # Custom React hooks
    ├── lib/                # Shared utilities (supabase connection, class merges)
    └── providers/          # Global context providers (AuthProvider)
```

---

## 📄 License

This project is licensed under the MIT License. Feel free to copy, modify, and use it for your own web development portfolio.

---

## ✉️ Author / Contact

*   **Developer**: Syahreza Satria
*   **Location**: Bandung, Indonesia
*   **GitHub**: [@syahreza-satria](https://github.com/syahreza-satria)
