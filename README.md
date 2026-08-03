# Syahreza Satria's Developer Portfolio

A premium, interactive developer portfolio designed to showcase professional skills, projects, and achievements. This platform solves the challenge of presenting a developer's capabilities statically by providing an engaging, animated user interface combined with a real-time guestbook and a secure administrator dashboard for live content management.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-emerald?style=flat-square&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

---

## 💡 Why This Project Exists

The primary motivation behind this portfolio is to break away from traditional, static resumes. In today's fast-paced digital landscape, a developer's true capabilities are best demonstrated through live, interactive experiences rather than plain text. 

This project was built to:
* **Showcase Full-Stack Proficiency:** Go beyond a simple landing page by integrating a real-time guestbook and a complete custom CRUD dashboard with secure authentication.
* **Experiment with Modern Technologies:** Serve as a practical playground for implementing Next.js 16 (App Router), Supabase real-time capabilities, and complex UI animations (Framer Motion).
* **Create a Living Digital Identity:** Provide a centralized, easily updatable platform that evolves alongside my career, skills, and projects, ensuring visitors always see the most current representation of my professional journey.

---

## 🚀 Key Features

*   **Vibrant & Modern UI/UX**: Crafted with a premium dark-mode aesthetic, custom gradients, glassmorphism, spotlight card effects, and rotating/shiny text animations.
*   **Adaptive Responsive Layout**: Implements a sticky side navigation for desktops and a fluid, responsive dock menu for mobile and tablet views.
*   **Dynamic Project Gallery (Supabase-integrated)**:
    *   **Live Search**: Instant client-side search across titles and descriptions.
    *   **Categorized Filters**: Smooth tab-based filters for project categories (e.g., Full-Stack Web, Mobile, Design).
    *   **Immersive Modal View**: Framer Motion animated modal detailing tech stacks, features, screenshots, and live demo links.
*   **Admin CRUD Control Center**:
    *   **Authentication & Authorization**: Integrated Google OAuth via Supabase checking for specific admin privileges.
    *   **On-Site Editing**: Secure interactive modal forms (`CrudModal`) to add, update, or remove projects directly from the web interface.
*   **Real-time Guestbook Chat**:
    *   **Social Sign-In**: Quick Google OAuth sign-in for users to leave a message.
    *   **Real-time Synchronization**: Live updates for new posts, replies, and reactions using Supabase Postgres replication.
    *   **Interactive Reactions**: Add emoji reactions with live count badge updates.
    *   **Threaded Replies**: Quote parent messages and easily jump to the referenced message.
*   **Interactive Skillset Grid**: Interactive filtering of skills and tools with layout-preserving spring animations.
*   **Comprehensive Sections**: Curated pages for *About Me* (education/career timeline), *Achievements* (credential listings), *Gears* (workspace setup details), and *Contact*.

---

## 🛠️ Tech Stack

*   **Frontend Core**: Next.js 16 (App Router), React 19
*   **Styling & UI**: Tailwind CSS v4, Radix UI, Shadcn UI
*   **Animations**: Motion (Framer Motion), GSAP
*   **Database & Real-time**: Supabase Database, Supabase Realtime Channels
*   **Authentication**: Supabase Auth (Google OAuth)
*   **Icons**: Lucide React, React Icons

---

## 📸 Screenshots / Demo

*Stay tuned! Screenshots and demo previews will be added here shortly.*

*   **Desktop Dashboard Preview**:
    `![Desktop UI Preview Placeholder](https://placehold.co/800x450/0f0f10/ffffff?text=Desktop+UI+Preview)`
*   **Real-time Guestbook**:
    `![Guestbook Preview Placeholder](https://placehold.co/800x450/0f0f10/ffffff?text=Real-time+Guestbook+Preview)`

---

## 📋 Prerequisites

Before setting up the project, make sure you have the following installed:
*   **Node.js**: `v18.x` or newer (recommended: `v20.x` or higher)
*   **NPM**: `v9.x` or newer (or Yarn / PNPM / Bun)
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
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Supabase Schema Migration
In your **Supabase SQL Editor**, execute the following scripts to provision the tables, Row Level Security (RLS) policies, and database replication:

```sql
-- 1. Create Projects Table
create table projects (
  id bigint generated by default as identity primary key,
  title text not null,
  description text not null,
  image text,
  type text not null,
  category text not null,
  techstack text[] default '{}'::text[],
  demo_link text,
  github text,
  status text default 'In Progress',
  role text,
  features text[] default '{}'::text[],
  gallery text[] default '{}'::text[],
  project_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table projects enable row level security;

-- Create Policies for Projects
create policy "Allow public read access" on projects
  for select using (true);

create policy "Allow admin full access" on projects
  for all using (
    auth.jwt() ->> 'email' = 'admin@example.com' -- Replace with your actual admin email
  );

-- 2. Create Guestbook Table
create table guestbook (
  id bigint generated by default as identity primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid not null,
  user_name text not null,
  user_email text not null,
  user_avatar text,
  message text not null,
  reactions jsonb default '{}'::jsonb not null,
  parent_id bigint references guestbook(id) on delete set null
);

-- Enable RLS on Guestbook
alter table guestbook enable row level security;

-- Create Policies for Guestbook
create policy "Allow public read access" on guestbook
  for select using (true);

create policy "Allow authenticated insert access" on guestbook
  for insert with check (auth.uid() = user_id);

create policy "Allow authenticated update access" on guestbook
  for update using (auth.role() = 'authenticated');

create policy "Allow delete access" on guestbook
  for delete using (
    auth.uid() = user_id or 
    auth.jwt() ->> 'email' = 'admin@example.com' -- Replace with your actual admin email
  );

-- Enable Realtime replication
alter publication supabase_realtime add table public.guestbook;
```

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
├── public/                 # Static assets (images, icons, favicon)
└── src/
    ├── app/                # Next.js App Router (pages and layouts)
    │   ├── about/          # Career timeline & bio
    │   ├── achievement/    # Certificates list
    │   ├── contact/        # Contact form page
    │   ├── gears/          # Workspace tech specs & equipment
    │   ├── guestbook/      # Real-time chat & guest posts
    │   └── projects/       # Database showcase with admin CRUD modal
    ├── components/         # React Components
    │   ├── custom/         # UI layouts (SideNav, forms, transition loaders)
    │   └── ui/             # Radix & Shadcn based UI primitives
    ├── constants/          # Application-wide static data & animations
    ├── hooks/              # Custom React hooks (useAuth)
    ├── lib/                # Shared utilities (supabase connection, class merges)
    └── providers/          # Global context providers (AuthProvider)
```

---

## 🔒 Environment Variables

Ensure these environment variables are defined in your deployment settings or `.env` file:

| Variable Name | Description | Example / Format |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL endpoint | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`| Your Supabase public API access key | `eyJhbGciOiJIUzI1Ni...` |

---

## 📄 License

This project is licensed under the MIT License. Feel free to copy, modify, and use it for your own web development portfolio.

---

## ✉️ Author / Contact

*   **Developer**: Syahreza Satria
*   **Location**: Bandung, Indonesia
*   **GitHub**: [@syahreza-satria](https://github.com/syahreza-satria)
