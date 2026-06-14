# 🚀 Syahreza Satria's Developer Portfolio (2026 Edition)

Welcome to the official repository of **Syahreza Satria's Portfolio**, a modern, responsive, and dynamic web application showcasing skills, professional experience, achievements, and projects. 

This portfolio features an immersive dark-mode aesthetic, micro-animations, full **CRUD (Create, Read, Update, Delete) project management**, and a **real-time interactive Guestbook chat** with a database backend.

---

## 🛠️ Built With

The project is built on a modern frontend/backend stack:

*   **Framework**: [Next.js 16](https://nextjs.org/) (React 19 App Router)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Database & Authentication**: [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
*   **Animations**: [Motion](https://motion.dev/) (Framer Motion)
*   **Icons**: [React Icons](https://react-icons.github.io/react-icons/) & [Lucide React](https://lucide.dev/)
*   **UI Components**: [Shadcn UI](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)

---

## ✨ Key Features

1.  **Sleek Modern UI/UX**: Designed with vibrant custom gradient accents, glassmorphic navigations, interactive hover micro-animations, rotating text components, and shiny text highlights.
2.  **Adaptive Navigation**: Uses a robust sticky sidebar on desktop screens and a floating dock/header for mobile and tablet devices.
3.  **Supabase-Powered Dynamic Projects Showcase**:
    *   **Search**: Instant client-side search across project titles and descriptions.
    *   **Categorization & Filters**: Dynamic tabs to filter projects by Category (Full-Stack Web, UI/UX Design, Mobile Development, etc.) and Type (Web App, Mobile App, Design, etc.).
    *   **Immersive Lightbox Preview**: A spring-animated detail modal showing the project's cover image, description, detailed tech stack, source code link, and live demo link.
4.  **Admin CRUD Panel**:
    *   **Authentication**: Integrated Google OAuth via Supabase.
    *   **Authorization**: Checks for the owner's email (e.g. `<your-admin-email>`) or specific admin roles to reveal admin actions.
    *   **Real-time Modifying**: Interactive custom forms (`CrudModal`) to add, edit, or delete projects directly from the user interface.
5.  **Real-time Guestbook Chat**:
    *   **OAuth Access**: Guests can log in instantly via Google OAuth to post messages.
    *   **Real-time Feed**: Messages, replies, and reactions synchronize immediately across all screens without reloading using Supabase Postgres replication.
    *   **Reactions**: Interactive emoji reactions with dynamic user count indicators.
    *   **WhatsApp-style Replies**: Quote original messages and tap on quote boxes to smoothly scroll back to the original message.
    *   **Self-Deletion & Admin Controls**: Users can delete their own posts, while the Admin has delete rights on all messages.
6.  **Interactive Skillset Filtering**: Filter skillset items (HTML, Laravel, React, Node.js, Flutter, Figma, etc.) interactively with layout spring animations.
7.  **Additional Sections**:
    *   **About**: Career journey, education timeline, and detailed experience breakdown.
    *   **Achievements**: Certification details, categories, and credentials.
    *   **Gears**: A curated setup listing hardware and gear.
    *   **Contact**: Built-in functional contact form.

---

## 📂 Project Structure

```text
├── public/                # Static assets, branding, and images
└── src/
    ├── app/               # Next.js App Router paths
    │   ├── about/         # Profile & resume info page
    │   ├── achievement/   # Certificates showcase
    │   ├── contact/       # Contact form & social connections
    │   ├── gears/         # Workspace setup & tech specs
    │   ├── guestbook/     # Real-time message board / chat
    │   ├── projects/      # DB-connected projects page (with Admin CRUD)
    │   └── data/          # Local static datasets (skills, experience, etc.)
    ├── components/        # Shared components
    │   ├── custom/        # Layout elements (SideNav, CrudModal, cards, etc.)
    │   └── ui/            # Reusable UI primitives (Tabs, inputs, dropdowns)
    └── lib/               # Utility functions (auth, Supabase client initialization)
```

---

## 🚀 How to Run Locally

### 1. Prerequisites
Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18.x or newer recommended)
*   [NPM](https://www.npmjs.com/) or another package manager (Yarn, PNPM, Bun)
*   A [Supabase](https://supabase.com/) account and project.

### 2. Clone the Repository
```bash
git clone https://github.com/syahreza-satria/portfolio-2026.git
cd portfolio-2026
```

### 3. Setup Environment Variables
Create a `.env` or `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Create the Supabase Database Schema
To support both the dynamic projects showcase and the real-time guestbook, execute the following SQL scripts inside your Supabase project's **SQL Editor**:

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

-- Enable RLS (Row Level Security) on projects
alter table projects enable row level security;

-- Create Policy to allow anyone to read projects
create policy "Allow public read access" on projects
  for select using (true);

-- Create Policy to allow authenticated admin to manage projects
-- Note: Replace 'admin@example.com' with your actual admin email address
create policy "Allow admin full access" on projects
  for all using (
    auth.jwt() ->> 'email' = 'admin@example.com'
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

-- Enable RLS on guestbook
alter table guestbook enable row level security;

-- Create policies for guestbook
create policy "Allow public read access" on guestbook
  for select using (true);

create policy "Allow authenticated insert access" on guestbook
  for insert with check (auth.uid() = user_id);

create policy "Allow authenticated update access" on guestbook
  for update using (auth.role() = 'authenticated');

create policy "Allow delete access" on guestbook
  for delete using (
    auth.uid() = user_id or 
    auth.jwt() ->> 'email' = 'admin@example.com'
  );

-- Enable Realtime for the guestbook table
alter publication supabase_realtime add table public.guestbook;
```

### 5. Setup Google OAuth in Supabase
To enable the Auth and Guestbook features:
1.  Go to **Supabase Dashboard** -> **Authentication** -> **Providers**.
2.  Enable **Google** and enter your Google OAuth client ID and secret (obtained from the [Google Cloud Console](https://console.cloud.google.com/)).
3.  Add the redirect URI provided by Supabase back into your Google Cloud console credentials.

### 6. Install Dependencies
```bash
npm install
```

### 7. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to view the portfolio.

---

## 📦 Production Deployment

To build and run the optimized production bundle:

```bash
npm run build
npm run start
```

You can easily deploy this repository on hosting platforms like [Vercel](https://vercel.com/), [Netlify](https://netlify.com/), or [Render](https://render.com/). Be sure to inject your environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the platform settings.

---

## 📄 License

This project is licensed under the MIT License - feel free to use and modify it for your own personal portfolio.
